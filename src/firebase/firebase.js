import * as firebase from "firebase";

let firebaseConfig = null;
if (process.env.REACT_APP_IS_APP_ENGINE === "true") {
    firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOM,
        databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJ_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
    };
} else {
    firebaseConfig = {
        apiKey: "AIzaSyC59SUHJNpdaJSdYMpzXZJnVlX_efSfrJI",
        authDomain: "cp-cdo-develop-atlas-b80a.firebaseapp.com",
        databaseURL: "https://cp-cdo-develop-atlas-b80a.firebaseio.com",
        projectId: "cp-cdo-develop-atlas-b80a",
        storageBucket: "cp-cdo-develop-atlas-b80a.appspot.com",
        messagingSenderId: "582590414146",
        appId: "1:582590414146:web:86b60d233b920a36dfdcdb"
    };
}

firebase.initializeApp(firebaseConfig);

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider };