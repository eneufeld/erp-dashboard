import createTimeEntry from "./TimeEntry";
/**
 * Load the cars from the spreadsheet
 * Get the right values from it and assign.
 */
export function loadSheetData(rangeString, callback) {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        range: rangeString
      })
      .then(
        response => {
          const data = response.result.values;
          const entries = data.slice(1).map(row => createTimeEntry(row)) || [];
          callback(entries);
        },
        response => {
          callback(false, response.result.error);
        }
      );
  });
}