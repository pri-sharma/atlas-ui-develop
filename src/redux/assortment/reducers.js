import actions from './actions';

const initState = {
    assortments: [],
    pending: false,
    error: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_ASSORTMENTS_PENDING:
            return {
                ...state,
                pending: false
            };
        case actions.GET_ASSORTMENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                assortments: action.payload
            };
        case actions.GET_ASSORTMENTS_ERROR:
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