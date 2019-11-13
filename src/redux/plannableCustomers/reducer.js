import actions from './actions';

const initState = {
    plannableCustomers: [],
    selectedCustomer: '',
    customerStartDay: null,
    planningConfig: {},
    pendingPlanConfig: false,
};

const setSelectedCustomer = (prevState, action) => {
    const customer = prevState.plannableCustomers.find(obj => obj.id === action.payload);
    return {
        ...prevState,
        customerStartDay: customer['startday'],
        selectedCustomer: action.payload,
        pendingPlanConfig: true,
    }
};

const getPlannableCustomers = (prevState, action) => {
    return {
        ...prevState,
        plannableCustomers: action.payload
    }
};

const getPlanningConfig = (prevState, action) => {
    return {
        ...prevState,
        planningConfig: action.payload,
        pendingPlanConfig: false,
    }
};

const reducer = (prevState = initState, action) => {
    switch (action.type) {
        case actions.SET_CUSTOMER:
            return setSelectedCustomer(prevState, action);
        case actions.GET_PLANNABLE_CUSTOMERS:
            return getPlannableCustomers(prevState, action);
        case actions.GET_PLANNING_CONFIG:
            return getPlanningConfig(prevState, action);
        default:
            return prevState;
    }
};

export default reducer;