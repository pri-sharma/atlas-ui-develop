import actions from './actions';

const initState = {
    addedGroup:'',
    users: [],
    customers: [],
    groups: [],
    groupUserRoles: [],
    salesorgs: [],
    pending: false,
    ur_pending: false,
    error: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_GROUP_PENDING:
            return {
                ...state,
                pending: false
            };
        case actions.GET_GROUP_SUCCESS:
            return {
                ...state,
                pending: false,
                groups: action.payload
            };
        case actions.GET_GROUP_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.GET_USER_ROLES_PENDING:
            return {
                ...state,
                ur_pending: false
            };
        case actions.GET_USER_ROLES_SUCCESS:
            return {
                ...state,
                ur_pending: false,
                groupUserRoles: action.payload
            };

        case actions.GET_USER_ROLES_ERROR:
            return {
                ...state,
                ur_pending: false,
                error: action.error
            };
        case actions.ADD_GROUP:
            return {
                ...state,
                groups: state.groups.concat(action.payload),
                addedGroup: action.payload.id
            };
        case actions.ADD_USER_ROLE:
            return {
                ...state,
                groupUserRoles: state.groupUserRoles.concat(action.payload),
                groups: updateGroup(action.payload, state.groups)
            };
        case actions.DELETE_GROUP:
            return {
                ...state,
                groups: state.groups.filter(x => x.id !== action.payload.id)
            };
        case actions.DELETE_USER:
            return {
                ...state,
                groupUserRoles: state.groupUserRoles.filter(x => x.id !== action.payload.id)
            };
        case actions.DELETE_CUSTOMER:
            return {
                ...state,
                customer: state.customers.filter(x => x.id !== action.payload.id)
            };
        case actions.UPDATE_GROUP:
            return {
                ...state,
                groups: updateGroup(action.payload, state.groups)
            };
        case actions.UPDATE_CUSTOMERS:
            return {
                ...state,
                groups: updateGroup(action.payload, state.groups)
            };
        case actions.GET_CUSTOMERS_BY_SALESORG:
            return {
                ...state,
                customers: action.payload
            };
        case actions.GET_USERS:
            return {
                ...state,
                users: action.payload
            };
        case actions.GET_SALESORG:
            return {
                ...state,
                salesorg: action.payload
            }
        default:
            return state;
    }
};

function updateGroup(group, groups) {
    groups[groups.findIndex(x => x.id === group.id)] = group;
    return groups;
}

export default reducer;