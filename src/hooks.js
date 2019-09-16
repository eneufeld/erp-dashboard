import { useContext, useEffect, useState } from 'react';
import { UserContext } from "./components/UserContext";
import { loadSheetData } from './sheet';

export function useTimePlanningSheet(range) {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)
    const [data, setData] = useState([])
    const { isSignedIn } = useContext(UserContext)
    const fetchSheetData = () => {
        if (isSignedIn) {
            setLoading(true);
            loadSheetData(range, (data, error) => {
                setLoading(false);
                if (data) {
                    setError(undefined)
                    setData(data)
                } else {
                    setError(error)
                    setData([])
                }
            })
        }
    }
    useEffect(() => fetchSheetData(), [isSignedIn]);

    return {
        error,
        data,
        fetch: fetchSheetData,
        isLoading,
    }
}

export const submit = (entries) => 
    window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      valueInputOption: "RAW",
      range: "Data",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: entries
      }
    });

export function useSubmit() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return {
        isSubmitting,
        submit: (entries) => {
            setIsSubmitting(true);
            return submit(entries).then(() => {
                setIsSubmitting(false)
            });
        }
    }
}