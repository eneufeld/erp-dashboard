import { MONTH } from "./MonthContext";

const getGeneralRange= (month:MONTH):string => {
  switch(month) {
    case MONTH.PREVIOUS: return 'A4:B9';
    case MONTH.CURRENT: return 'F4:G9';
    case MONTH.NEXT: return 'K4:L9';
  };
}
export function loadGeneralData(user:string, month:MONTH, onData:(data:GeneralData)=> void, onError:(error:Error)=>void) {
  const client:any =  gapi.client;
  gapi.client.load("sheets", "v4", () => {
    client.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_DASHBOARDS_ID as string,
      range:`${user}!${getGeneralRange(month)}`
    }).then(
      (response:any) => {
        const data = response.result.values;
        if(data === undefined){
          onError(new Error('No Data!'));
        }
        const generalData:GeneralData = data!.reduce((acc:any,row:any) => {
          switch(row[0]) {
            case 'Vacation':acc.vacation=row[1];break;
            case 'Holidays':acc.holidays=row[1];break;
            case 'Assigned Remaining':acc.remaining=row[1];break;
            case 'Predicted Gap':acc.gap=row[1];break;
            case 'Assigned Total':acc.total=row[1];break;
            case 'Current Days':acc.current=row[1];break;
          }
          return acc;
        },{});
        onData(generalData);
      },
      (response:any) => {
        onError(response.result.error);
      }
    );
  });
}

export interface GeneralData {
  vacation:number;
  holidays:number;
  remaining:number;
  gap:number;
  total:number;
  current:number;
}

const getProjectDataRange= (month:MONTH):string => {
  switch(month) {
    case MONTH.PREVIOUS: return 'A45:D71';
    case MONTH.CURRENT: return 'F45:I71';
    case MONTH.NEXT: return 'K45:N71';
  };
}
export function loadProjectData(user:string, month:MONTH, onData:(data:ProjectOverview[])=> void, onError:(error:Error)=>void) {
  const client:any =  gapi.client;
  gapi.client.load("sheets", "v4", () => {
    client.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_DASHBOARDS_ID as string,
      range:`${user}!${getProjectDataRange(month)}`
    }).then(
      (response:any) => {
        const data = response.result.values;
        if(data === undefined){
          onError(new Error('No Data!'));
        }
        const generalData:ProjectOverview[] = data!.map((row:any) => {
          return {name:row[0], gap:row[3], total:row[2], current:(row[1]|0)};
        });
        onData(generalData);
      },
      (response:any) => {
        onError(response.result.error);
      }
    );
  });
}
export interface ProjectOverview {
  name:string;
  gap:number;
  total:number;
  current:number;
}


const getOverviewRange= (month:MONTH):string => {
  switch(month) {
    case MONTH.PREVIOUS: return 'A12:B42';
    case MONTH.CURRENT: return 'F12:G42';
    case MONTH.NEXT: return 'K12:L42';
  };
}
export function loadOverviewData(user:string, month:MONTH, onData:(data:DailySum[])=> void, onError:(error:Error)=>void) {
  const client:any =  gapi.client;
  gapi.client.load("sheets", "v4", () => {

    client.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_DASHBOARDS_ID as string,
      range:`${user}!${getOverviewRange(month)}`
    }).then(
      (response:any) => {
        const data = response.result.values;
        if(data === undefined){
          onError(new Error('No Data!'));
        }
        const generalData:DailySum[] = data!.map((row:any) => {
          return {date:row[0], total:row[1]};
        });
        onData(generalData);
      },
      (response:any) => {
        onError(response.result.error);
      }
    );
  });
}
export interface DailySum {
  date:string;
  total:number;
}

export const submit = (entries:any[][]) => {
  const appendValue = {
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_DATA_ID as string,
      valueInputOption: "RAW",
      range: "Data!B2",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: entries
      }
    };
    const client:any =  gapi.client;
  return client.sheets.spreadsheets.values.append(appendValue);
}