import actions from './actions';

const initState = {
    settings: {},
    languages: [],
    pending: false,
    error: null,
    show_alert: false,
};

const reducers = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_USER_SETTINGS_PENDING:
            return {
                ...state,
                pending: true
            };
        case actions.GET_USER_SETTINGS:
            return {
                ...state,
                pending: false,
                settings: action.payload
            };
        case actions.GET_LANGUAGES:
            return {
                ...state,
                pending: false,
                languages: action.payload
            };
        case actions.SAVE_USER_SETTINGS:
            alert('Settings have been successfully updated');
            return {
                ...state,
                settings: action.payload,
                show_alert:true
            };
        default:
            return state;
    }
};

export default reducers;