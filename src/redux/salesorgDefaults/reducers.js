import actions from './actions';

const initState = {
    users: [],
    customers: [],
    sales_org_defaults: [],
    roles: [],
    pending: false,
    error: null,
};

const reducers = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_SALES_ORG_DEFAULTS_PENDING:
            return {
                ...state,
                pending: false
            };
        case actions.GET_SALES_ORG_DEFAULTS_SUCCESS:
            return {
                ...state,
                pending: false,
                sales_org_defaults: action.payload
            };
        case actions.GET_SALES_ORG_DEFAULTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.ADD_SALES_ORG_DEFAULTS:
            return {
                ...state,
                sales_org_defaults: [action.payload, ...state.sales_org_defaults]
            };
        // case actions.DELETE_NEWS:
        //     return {
        //         ...state,
        //         news: state.news.filter(x => x.id !== action.payload.id)
        //     };
        case actions.UPDATE_SALES_ORG_DEFAULTS:
            return {
                ...state,
                sales_org_defaults: updateNews(action.payload, [...state.sales_org_defaults])
            };
        default:
            return state;
    }
};

function updateNews(sales_org_defaults, all_sales_org_defaults) {
    all_sales_org_defaults[all_sales_org_defaults.findIndex(x => x.id === sales_org_defaults.id)] = sales_org_defaults;
    return all_sales_org_defaults;
}

export default reducers;