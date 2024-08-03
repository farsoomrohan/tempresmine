export const msalConfig = {
    auth: {
        clientId: '49d89fbb-afad-49f8-97bb-7ff26d0051d3',
        authority: 'https://login.microsoftonline.com/a858d9da-8dfa-4b12-9f90-d0448a34f6d1',
        redirectUri: 'https://resumeminner.azurewebsites.net/home',
        // redirectUri: 'http://localhost:3000/home',
        postLogoutRedirectUri: "/",
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
    }
}
