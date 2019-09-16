import React from 'react'; 
import { Grid, TextField, Button, withStyles, Snackbar } from '@material-ui/core';
import ReactTable from 'react-table'
import createTimeEntry from '../TimeEntry';
import SnackbarContentWrapper from './Snackbar';
import { submit } from '../hooks';

const styles = {
  submit: {
    marginTop: 10
  }
}

const fromTimeEntry = entry => {
  return [entry.date, entry.customer, entry.employee, entry.employee, entry.hours, entry.comment]
}

const HOURS_HEADER = "Hours"

class TimeReportSubmitForm extends React.Component {

  state = {
    text: '',
    tableEntries: [],
    rawEntries: [],
    isSnackbarOpen: false,
    isSubmitting: false
  }

  handleCloseSnackbar = () => {
    this.setState({ isSnackbarOpen: false })
  }

  handleChange = ev => {
    const text = ev.target.value;
    this.setState({ text  })
    const rows = text.split(/\r?\n/);
    const firstRow = rows[0].split(/\\/)
    const employee = firstRow[0];
    const date = firstRow[1];
    const tableEntries = rows.slice(2).map(row => {
      const cells = row.split(/\\/)
      return createTimeEntry([date, cells[0], employee, employee, cells[1], cells[2]])
    });
    const e = rows.slice(2).map(row => {
      const cells = row.split(/\\/)
      return [date, cells[0], employee, employee, cells[1], cells[2]]
    });
    this.setState({ tableEntries })
    this.setState({ rawEntries: e})
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    submit(this.state.rawEntries).then(() => {
      onSubmit()
      this.setState({
        text: "",
        isSnackbarOpen: true,
        tableEntries: []
      });
    })
  }

  handleClear = () => {
    this.setState({
      text: "",
      tableEntries: [],
    })
  }

  renderEditableCell = ({ value, index, column, ...cellInfo }) => {
    return (
      <TextField
        type={column.Header === HOURS_HEADER ? "number" : "text"}
        fullWidth
        value={value}
        onChange={(ev) => {
          const data = [...this.state.tableEntries]
          data[index][column.id] = ev.target.value;
          this.setState({ rawEntries: data.map(fromTimeEntry) })
        }}
      />
    )
  }

  render() {
    const { classes, isLoading } = this.props;
    return (
      <div style={{ margin: 10 }}>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.isSnackbarOpen}
          autoHideDuration={5000}
          onClose={this.handleCloseSnackbar}
        >
          <SnackbarContentWrapper
            variant="success"
            message="Time report submitted!"
          />
        </Snackbar>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Paste your time here"
              variant="outlined"
              multiline
              onChange={this.handleChange}
              value={this.state.text}
              rows={10}
              disabled={this.state.text.length > 0}
            />
          </Grid>
          <Grid item xs={9}>
            <ReactTable
              data={this.state.tableEntries}
              columns={[
                {
                  Header: "Date",
                  accessor: "date",
                  minResizeWidth: 120,
                  width: 120
                },
                {
                  Header: "Customer",
                  accessor: "customer",
                  minResizeWidth: 150,
                  width: 150,
                  Cell: this.renderEditableCell
                },
                {
                  Header: HOURS_HEADER,
                  accessor: "hours",
                  minResizeWidth: 80,
                  width: 80,
                  Cell: this.renderEditableCell
                },
                {
                  Header: "Comment",
                  accessor: "comment",
                  minResizeWidth: 200,
                  Cell: this.renderEditableCell
                }
              ]}
              pageSize={10}
              showPaginationBottom={false}
            />
          </Grid>
          <Grid item xs={3}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                className={classes.submit}
                variant="outlined"
                color="secondary"
                onClick={this.handleSubmit}
                disabled={isLoading || this.state.isSubmitting}
              >
                {this.state.isSubmitting ? "Submitting" : "Submit"}
              </Button>
              <Button
                className={classes.submit}
                color="primary"
                variant="outlined"
                onClick={this.handleClear}
                disabled={isLoading || this.state.isSubmitting}
              >
                Clear
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };
}

export default withStyles(styles)(TimeReportSubmitForm);
