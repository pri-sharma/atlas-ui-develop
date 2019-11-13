import { firebase, googleAuthProvider } from '../../firebase/firebase';

export const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});


export const login = (uid, email, photoURL, idToken) => ({
    type: 'LOGIN',
    uid,
    email,
    photoURL,
    idToken
});

export const logout = () => {
    firebase.auth().signOut();
    localStorage.removeItem('idToken');
    return {
        type: 'LOGOUT'
    };
};

export const firebaseLogin = () => {
    return (dispatch) => {
       return firebase.auth().signInWithRedirect(googleAuthProvider).then(
           function(redirectResult) {
                let uid = redirectResult.user.uid;
                let email = redirectResult.user.email;
                let photoURL = redirectResult.user.photoURL;
                redirectResult.user.getIdToken().then(function(idToken) {
                    localStorage.setItem("idToken", idToken);
                    dispatch(login(uid, email, photoURL, idToken));
                })
           }
       );
    };
};

export const checkAuthorization = () => (
    {
        type: 'CHECK_AUTHORIZATION'
    }
);

export const actions = {
    logout: {
        type: 'LOGOUT'
    },
    login: {
        type: 'LOGIN',
    },
    checkAuthorization: () => ({
        type: 'CHECK_AUTHORIZATION'
    })
};

export default actions;