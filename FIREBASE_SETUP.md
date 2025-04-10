# Firebase Authentication Setup

This document provides instructions on how to set up Firebase Authentication for the application.

## Prerequisites

1. A Google account
2. A Firebase project

## Steps to Set Up Firebase Authentication

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on "Add project" and follow the steps to create a new project.
3. Give your project a name and follow the setup wizard.

### 2. Register Your Web App

1. In the Firebase Console, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings".
2. Scroll down to the "Your apps" section and click on the web icon (</>) to add a web app.
3. Register your app with a nickname (e.g., "OLX Clone").
4. Click "Register app".

### 3. Get Your Firebase Configuration

After registering your app, Firebase will provide you with a configuration object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 4. Update the Firebase Configuration in Your App

1. Open the file `src/firebase.js` in your project.
2. Replace the placeholder values in the `firebaseConfig` object with your actual Firebase configuration values.

### 5. Enable Google Authentication

1. In the Firebase Console, go to "Authentication" from the left sidebar.
2. Click on the "Sign-in method" tab.
3. Click on "Google" in the list of providers.
4. Toggle the "Enable" switch to enable Google authentication.
5. Add your authorized domain (e.g., localhost for development).
6. Click "Save".

### 6. Update Your Backend

Make sure your backend is configured to verify Firebase ID tokens. The server should:

1. Receive the ID token from the client.
2. Verify the token using the Firebase Admin SDK.
3. Create or update the user in your database.
4. Generate a session token for your application.

## Testing

After completing the setup, you should be able to:

1. Click the "Sign in with Google" button in your application.
2. Select a Google account to sign in with.
3. Be redirected back to your application as an authenticated user.

## Troubleshooting

- If you encounter CORS issues, make sure your Firebase project has the correct authorized domains.
- If authentication fails, check the browser console for error messages.
- Ensure that your Firebase configuration is correctly copied into the `firebase.js` file.

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Web SDK Documentation](https://firebase.google.com/docs/web/setup)
- [Google Sign-In Documentation](https://firebase.google.com/docs/auth/web/google-signin) 