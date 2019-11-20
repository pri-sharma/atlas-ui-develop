import actions from './actions';

const initState = {
    gridviewstructure: [],
    gridviewdata: [],
    gridviewstate: [],
    user: [],
    pending: false,
    error: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_GRIDVIEW_STRUCTURE:
            return {
                ...state,
                pending: false
            };
        case actions.GET_GRIDVIEW_STRUCTURE_SUCCESS:
            return {
                ...state,
                pending: false,
                gridviewstructure: action.payload
            };
        case actions.GET_GRIDVIEW_STRUCTURE_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.GET_GRIDVIEW_STATE:
            return {
                ...state,
                pending: false
            };
        case actions.GET_GRIDVIEW_STATE_SUCCESS:
            return {
                ...state,
                pending: false,
                gridviewstate: action.payload
            };
        case actions.GET_GRIDVIEW_STATE_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.GET_GRIDVIEW_DATA:
            return {
                ...state,
                pending: false
            };
        case actions.GET_GRIDVIEW_DATA_SUCCESS:
            return {
                ...state,
                pending: false,
                gridviewdata: action.payload
            };
        case actions.GET_GRIDVIEW_DATA_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.GET_USER_DATA:
            return {
                ...state,
                pending: false
            };
        case actions.GET_USER_SUCCESS:
            return {
                ...state,
                pending: false,
                user: action.payload
            };
        case actions.GET__ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
};

export default reducer;