import actions from './actions';

const initState = {
    users: [],
    customers: [],
    assignments: [],
    detailedAssignments:[],
    roles: [],
    pending: false,
    error: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_ASSIGNMENTS_PENDING:
            return {
                ...state,
                pending: false
            };
        case actions.GET_ASSIGNMENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                assignments: action.payload
            };
        case actions.GET_ASSIGNMENTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.ADD_ASSIGNMENT:
        {
            let existing = null;
            let newArray = [];
            for (let a of state.assignments) {
                if (a.customer.id === action.payload.customer.id) {
                    a.count += 1;
                    existing = a;
                }
                newArray.push(a);
            }
            if (!existing) {
                action.payload.count = 1;
                newArray.push(action.payload);
            }
            return {
                ...state,
                assignments: newArray,
               }
        };
        case actions.DELETE_ASSIGNMENT: {
            let cust_id = action.payload.customer.id;
            let newDetailedArray = state.detailedAssignments[cust_id].filter(a => a.id !== action.payload.id);
            let newDetailedObj = {[cust_id]: newDetailedArray};
            let newCustArray = [];
            for (let a of state.assignments) {
                if (a.customer.id !== cust_id) {
                    newCustArray.push(a);
                } else if (a.count > 1) {
                    a.count -= 1;
                    newCustArray.push(a);
                }
            }
            return {
                ...state,
                assignments: newCustArray,
                detailedAssignments: {...state.detailedAssignments, ...newDetailedObj}
            };
        }
        case actions.UPDATE_ASSIGNMENT: {
            let cust_id = action.payload.customer.id;
            let newDetailedArray = state.detailedAssignments[cust_id].map(a => (a.id === action.payload.id) ? action.payload : a);
            let newDetailedObj = {[cust_id]: newDetailedArray};
            return {...state, detailedAssignments: {...state.detailedAssignments, ...newDetailedObj}};
        }
        case actions.GET_CUSTOMERS_BY_LEVEL:
            return {
                ...state,
                customers: action.payload
            };
        case actions.GET_USERS:
            return {
                ...state,
                users: action.payload
            };
        case actions.GET_ROLES:
            return {
                ...state,
                roles: action.payload
            };
        case actions.GET_DETAILED_ASSIGNMENTS:
            let newAss = action.payload;
            return {
                ...state,
                detailedAssignments: {...newAss}
            };
        default:
            return state;
    }
};

function updateAssignment(assignment, assignments) {
    assignments[assignments.findIndex(x => x.id === assignment.id)] = assignment;
    return assignments;
}

export default reducer;