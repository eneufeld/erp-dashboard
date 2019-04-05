export const getAuthInstance = () => window.gapi.auth2.getAuthInstance();

export const isSignedIn = () => getAuthInstance().isSignedIn().get()

export const initClient = (onSignIn) => {

    if (process.env.REACT_APP_API_KEY === undefined) {
        console.error("API_KEY key not configured")
    }

    if (process.env.REACT_APP_CLIENT_ID === undefined) {
        console.error("CLIENT_ID not configured")
    }

    if (process.env.REACT_APP_SPREADSHEET_ID === undefined) {
        console.error("SPREADSHEET_ID not configured")
    }


    // init client library
    function start() {
        window.gapi.client
            .init({
                apiKey: process.env.REACT_APP_API_KEY,
                clientId: process.env.REACT_APP_CLIENT_ID,
                discoveryDocs:
                    ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                scope: "https://www.googleapis.com/auth/spreadsheets",
                spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID

            })
            .then(() => {
                window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus(onSignIn));
                // Handle initial sign-in state
                updateSignInStatus(onSignIn)(window.gapi.auth2.getAuthInstance().isSignedIn.get());
            });
    }
    window.gapi.load('client:auth2', start)
}

export const updateSignInStatus = onSignIn => isSignedIn => {
    if (isSignedIn) {
        onSignIn(isSignedIn, window.gapi.auth2.getAuthInstance().currentUser.get());
    }
}

export function signIn() {
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    return window.gapi.auth2.getAuthInstance().signIn();
}

export function signOut() {
    console.log('signing out..')
    window.gapi.auth2.getAuthInstance().signOut();
}