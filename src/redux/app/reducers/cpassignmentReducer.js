const initialState = {};

const getCPAssignments = (prevState, action) => {
    return {...prevState, cpassignments: action.payload}
};

const getDetailedCPAssignments = (prevState, action) => {
    let newAss = action.payload;
    return {
        ...prevState,
        detailedAssignments: {...newAss}
    }
};

const addCPAssignment = (prevState, action) => {
    let existing = null;
    let newArray = [];
    // let cust_id = action.payload.customer.id;
    // let newDetailedArray = prevState.detailedAssignments[cust_id].map(a => (a.id === action.payload.id)  ? action.payload : a);
    // let newDetailedObj = {[cust_id]: newDetailedArray};
    // let newDetail = [];
    for (let a of prevState.cpassignments) {
        if (a.customer.id === action.payload.customer.id) {
            a.count += 1;
            existing = a;
            // newDetail.push(a);
        }
        newArray.push(a);
    }
    if (!existing) {
        action.payload.count = 1;
        newArray.push(action.payload);
        // newDetail.push(action.payload);
    }
    return {...prevState, cpassignments: newArray}
};

const updateCPAssignment = (prevState, action) => {
    let cust_id = action.payload.customer.id;
    let newDetailedArray = prevState.detailedAssignments[cust_id].map(a => (a.id === action.payload.id) ? action.payload : a);
    let newDetailedObj = {[cust_id]: newDetailedArray};
    return {...prevState, detailedAssignments: {...prevState.detailedAssignments, ...newDetailedObj}};
};

const deleteCPAssignment = (prevState, action) => {
    let cust_id = action.payload.customer.id;
    let newDetailedArray = prevState.detailedAssignments[cust_id].filter(a => a.id !== action.payload.id);
    let newDetailedObj = {[cust_id]: newDetailedArray};
    let newCustArray = [];
    for (let a of prevState.cpassignments) {
        if (a.customer.id !== cust_id) {
            newCustArray.push(a);
        }
        else if (a.count > 1) {
            a.count -= 1;
            newCustArray.push(a);
        }
    }
    return {...prevState, cpassignments: newCustArray, detailedAssignments: {...prevState.detailedAssignments, ...newDetailedObj}};
};

const getCustomersByLevel = (prevState, action) => {
    return {...prevState, customersByLevel: action.payload}
};

const getProductsBySalesOrg = (prevState, action) => {
    return {...prevState, productsBySalesOrg: action.payload}
};

const reducer = (prevState = initialState, action) => {
    switch(action.type){
        //case "LOG_IN":
            //return logInUser(prevState, action);
        case "GET_CPASSIGNMENTS":
            return getCPAssignments(prevState, action);
        case "GET_DETAILED_CPASSIGNMENTS":
            return getDetailedCPAssignments(prevState, action);
        case "ADD_CPASSIGNMENT":
            return addCPAssignment(prevState, action);
        case "UPDATE_CPASSIGNMENT":
            return updateCPAssignment(prevState, action);
        case "DELETE_CPASSIGNMENT":
            return deleteCPAssignment(prevState, action);
        case "GET_CUSTOMERS_BY_LEVEL":
            return getCustomersByLevel(prevState, action);
        case "GET_PRODUCTS_BY_SALES_ORG":
            return getProductsBySalesOrg(prevState, action);
        default:
            return prevState;
    }
};

export default reducer;