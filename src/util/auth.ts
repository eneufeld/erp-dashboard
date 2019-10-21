interface OnSignIn {
    (isSignedIn:boolean, user:gapi.auth2.GoogleUser):void
}
interface OnSignOut {
    ():void
}
export const initClient = (onSignIn:OnSignIn, onSignOut:OnSignOut) => () => {
    if (process.env.REACT_APP_API_KEY === undefined) {
        console.error("API_KEY key not configured")
    }

    if (process.env.REACT_APP_CLIENT_ID === undefined) {
        console.error("CLIENT_ID not configured")
    }

    if (process.env.REACT_APP_SPREADSHEET_DASHBOARDS_ID === undefined) {
        console.error("REACT_APP_SPREADSHEET_DASHBOARDS_ID not configured")
    }
    if (process.env.REACT_APP_SPREADSHEET_DATA_ID === undefined) {
        console.error("REACT_APP_SPREADSHEET_DATA_ID not configured")
    }
    const updateSignInStatus = () => (isSignedIn:boolean) => {
        if (isSignedIn) {
            onSignIn(isSignedIn, window.gapi.auth2.getAuthInstance().currentUser.get());
        } else {
            onSignOut();
        }
    }
    const start = () => {
        gapi.client.init({
            apiKey: process.env.REACT_APP_API_KEY,
            clientId: process.env.REACT_APP_CLIENT_ID,
            discoveryDocs:
                ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
            scope: "https://www.googleapis.com/auth/spreadsheets"
        })
        .then(() => {
                window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus());
                // Handle initial sign-in state
                updateSignInStatus()(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    };
    gapi.load('client:auth2', start);
    
};

export const signIn = (onSuccess:(value?: gapi.auth2.GoogleUser) => gapi.auth2.GoogleUser|void, onError:(reason?:any)=>Error|void):void =>{
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    window.gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(onSuccess, onError);
};

export const signOut = ():void => {
    window.gapi.auth2.getAuthInstance().signOut();
};