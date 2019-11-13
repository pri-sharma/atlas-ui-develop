export default (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                uid: action.uid,
                email: action.email,
                photoURL: action.photoURL,
                idToken: action.idToken
            };
 
        case 'LOGOUT':
            return {};
 
        default:
            return state;
    }
};