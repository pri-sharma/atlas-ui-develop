//const base_url = 'http://127.0.0.1:8002';
const base_url = process.env.REACT_APP_API_URL;
//const base_url = 'https://atlas-api-dot-cp-cdo-dev-atlas.appspot.com'
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});


const actions = {
    SET_CUSTOMER: 'SET_CUSTOMER',
    GET_PLANNABLE_CUSTOMERS: 'GET_PLANNABLE_CUSTOMERS',
    GET_PLANNING_CONFIG: 'GET_PLANNING_CONFIG',

    setSelectedCustomer: (customer) => {
        return {
            type: actions.SET_CUSTOMER,
            payload: customer,
        }
    },
    getPlannableCustomers: (customers) => {
        return {
            type: actions.GET_PLANNABLE_CUSTOMERS,
            payload: customers
        }
    },
    getPlanningConfig: (customer) => {
        return {
            type: actions.GET_PLANNING_CONFIG,
            payload: customer,
        }
    },

};

export const setSelectedCustomerAction = (customer) => {
    return dispatch => {
        dispatch(actions.setSelectedCustomer(customer));
        dispatch(getPlanningConfigAction(customer));
    }
};

const getPlanningConfigAction = (customer) => {
    return dispatch => {
        fetch(`${base_url}/api/v1/core/getplanningconfig/?customer_id=${customer}`, authHeaders())
            .then(r => r.json())
            .then(config => dispatch(actions.getPlanningConfig(config)))
            .catch(err => console.log(err))
    }
};

export const getPlannableCustomersAction = (user) => {
    return dispatch => {
        fetch(`${base_url}/api/v1/tm/customersforuser/?user=${user}`, authHeaders())
            .then(r => r.json())
            .then(customers => dispatch(actions.getPlannableCustomers(customers.results)))
            .catch(err => console.log(err))
    }
};

export default actions;
