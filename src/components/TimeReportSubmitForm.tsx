import React from 'react'; 
import { Grid, TextField, Button, withStyles, Snackbar } from '@material-ui/core';
import ReactTable, {Column, CellInfo} from 'react-table'
import createTimeEntry, { TimeEntry } from '../util/TimeEntry';
import SnackbarContentWrapper from './Snackbar';
import { submit } from '../util/sheet';

const styles = {
  submit: {
    marginTop: 10
  }
}
const fromTimeEntry = (entry:TimeEntry) => {
  return [entry.date, entry.customer, '', entry.employee, Number(entry.hours), entry.comment];
}

const HOURS_HEADER = "Hours"

interface TimeReportProps {
  classes:any;
  triggerUpdate:any;
}
interface TimeReportState {
  tableEntries:TimeEntry[];
  rawEntries:any[][];
  text:string;
  isSnackbarOpen:boolean;
  isSubmitting:boolean;
}
class TimeReportSubmitForm extends React.Component<TimeReportProps, TimeReportState> {

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

  handleChange = (ev:any) => {
    const text = ev.target.value as string;
    this.setState({ text  })

    if (this.isManicTimeString(text)){
      this.parseManicTime(text);
    } else {
      this.parseHamster(text, );
    }
  }

  private isManicTimeString(text: string): boolean {
    return text.startsWith('"');
  }

  private parseManicTime(text: string) {
    const rows = text.split(/\r?\n/).filter(r => r.length > 0 && !r.startsWith("\"Total\"")).map(row => row.substr(1, row.length - 2));
    const firstRow = rows[0].split(/"\t"/)
    const employee = firstRow[0];
    const date = firstRow[1];
    const dataRows = rows.slice(1);
    const tableEntries:TimeEntry[] = dataRows.map(row => {
      const cells = row.split(/"\t"/);
      return createTimeEntry([date, cells[0], employee, employee, cells[1], cells.length === 4?cells[3]:''])
    });
    const e:any[][] = dataRows.map(row => {
      const cells = row.split(/"\t"/)
      return [date, cells[0], employee, employee, Number(cells[1]), cells.length === 4?cells[3]:'']
    });
    this.setState({ tableEntries })
    this.setState({ rawEntries: e})
  }

  private parseHamster(text: string) {
    const rows = text.split(/\r?\n/).filter(r => r.length > 0);
    const firstRow = rows[0].split(/\\/)
    const employee = firstRow[0];
    const date = firstRow[1];
    const dataRows = rows.slice(1);
    const tableEntries:TimeEntry[] = dataRows.map(row => {
      const cells = row.split(/\\/)
      return createTimeEntry([date, cells[0], employee, employee, cells[1], cells[2]])
    });
    const e:any[][] = dataRows.map(row => {
      const cells = row.split(/\\/)
      return [date, cells[0], employee, employee, Number(cells[1]), cells[2]]
    });
    this.setState({ tableEntries })
    this.setState({ rawEntries: e})
  }

  handleSubmit = (triggerUpdate:any)=> () => {
    submit(this.state.rawEntries, () => {
      this.setState({
        text: "",
        isSnackbarOpen: true,
        tableEntries: []
      });
      triggerUpdate();
    });
  }

  handleClear = () => {
    this.setState({
      text: "",
      tableEntries: [],
    })
  }
  
  renderEditableCell = ({value, index, column}:CellInfo) => {
    return (
      <TextField
        type={column.Header === HOURS_HEADER ? "number" : "text"}
        fullWidth
        value={value}
        onChange={(ev:React.ChangeEvent) => {
          const data:TimeEntry[] = [...this.state.tableEntries];
          const fieldName = column.id! as keyof TimeEntry;
          const entry = data[index];
          const evTarget = (ev.target as HTMLInputElement);
          entry[fieldName] = (column.Header === HOURS_HEADER?evTarget.valueAsNumber:evTarget.value) as any;
          this.setState({ rawEntries: data.map(fromTimeEntry), tableEntries:data });
        }}
        inputProps={column.Header === HOURS_HEADER ? { style: {textAlign: 'right'}}:{} }
      />
    )
  }

  render() {
    const { classes, triggerUpdate } = this.props;

    const columns:Column[] = [
      {
        Header: "Date",
        accessor: "date",
        minWidth: 120,
        width: 120,
        className: 'center'
      },
      {
        Header: "Customer",
        accessor: "customer",
        minWidth: 150,
        width: 150,
        Cell: this.renderEditableCell
      },
      {
        Header: HOURS_HEADER,
        accessor: "hours",
        minWidth: 80,
        width: 80,
        Cell: this.renderEditableCell
      },
      {
        Header: "Comment",
        accessor: "comment",
        minWidth: 200,
        Cell: this.renderEditableCell
      }
    ];
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
        <Grid container spacing={2}>
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
              columns={columns}
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
                onClick={this.handleSubmit(triggerUpdate)}
                disabled={this.state.isSubmitting}
              >
                {this.state.isSubmitting ? "Submitting" : "Submit"}
              </Button>
              <Button
                className={classes.submit}
                color="primary"
                variant="outlined"
                onClick={this.handleClear}
                disabled={this.state.isSubmitting}
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
