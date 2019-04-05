import React, { useState, useCallback } from 'react'; 
import { Grid, TextField, Button, withStyles, Snackbar } from '@material-ui/core';
import ReactTable from 'react-table'
import { cols } from './TimeReportingTable';
import createTimeEntry from '../TimeEntry';
import SnackbarContentWrapper from './Snackbar';

const styles = {
  submit: {
    marginTop: 10
  }
}

const submit = entries => 
    window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        valueInputOption: 'RAW',
        range: 'Data',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: entries
        }
    })

const TimeReportSubmitForm = ({ classes, isLoading, onSubmit }) => {

    const [text, setText] = useState("");
    const [displayEntries, setDisplayEntries] = useState([])
    const [entries, setEntries] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const closeSnackbar = useCallback(() => setSnackbarOpen(false));
    const handleChange = useCallback(ev => {
        const text = ev.target.value;
        setText(text);
        const rows = text.split(/\r?\n/);
        const firstRow = rows[0].split(/\\/)
        const employee = firstRow[0];
        const date = firstRow[1];
        const displayedEntries = rows.slice(2).map(row => {
            const cells = row.split(/\\/)
            return createTimeEntry([date, cells[0], employee, employee, cells[1], cells[2] ])
        });
        const e = rows.slice(2).map(row => {
            const cells = row.split(/\\/)
            return [date, cells[0], employee, employee, cells[1], cells[2] ]
        });
        setDisplayEntries(displayedEntries);
        setEntries(e)
    });
    const handleSubmit = entries => useCallback(() => {
        setIsSubmitting(true);
        submit(entries).then(() => {
            onSubmit()
            setIsSubmitting(false)
            setText("");
            setDisplayEntries([])
        })
    });

    return (
      <div style={{ margin: 10 }}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={isSnackbarOpen}
                autoHideDuration={5000}
                onClose={closeSnackbar}
            >
                <SnackbarContentWrapper
                    variant="success"
                    message="Time report submitted!"
                />
            </Snackbar>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Paste your time here"
              variant="outlined"
              multiline
              onChange={handleChange}
              value={text}
              rows={10}
            />
            <Button
              className={classes.submit}
              variant='outlined'
              color='secondary'
              onClick={handleSubmit(entries)}
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
          </Grid>
          <Grid item xs={8}>
            <ReactTable
              data={displayEntries}
              columns={cols}
              pageSize={10}
            />
          </Grid>
        </Grid>
      </div>
    );
};

export default withStyles(styles)(TimeReportSubmitForm);
