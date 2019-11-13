import actions from './actions';

const initState = {
    salesorgs: [],
    pending: false,
    error: null,
    salesorgChanged: [],
    editing: false,
    saveError: null
};

const reducer = (state = initState, action) => {
    switch (action.type) {
            // FETCH
        case actions.FETCH_SALESORGS_PENDING:
            return {
                ...state,
                pending: true
            };
        case actions.FETCH_SALESORGS_SUCCESS:
            return {
                ...state,
                salesorgs: action.salesorgs,
                pending: false
            };
        case actions.FETCH_SALESORGS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.SET_SALESORG:
            return {
                ...state,
                salesorg: action.payload
            };

            // POST
        case actions.CHANGE_SALESORG:
            return {
                ...state,
                editing: true,
                salesorgs: updateSalesOrgs(action.salesorg, state.salesorgs)
            };
        default:
            return state;
    }
};

function updateSalesOrgs(sorg, salesorgs) {
    salesorgs[salesorgs.findIndex(x => x.id === sorg.id)] = sorg;
    return salesorgs;
}

export const getSalesOrgs = state => state.salesorgs;
export const getSalesOrgsPending = state => state.pending;
export const getSalesOrgsError = state => state.error;

export default reducer;