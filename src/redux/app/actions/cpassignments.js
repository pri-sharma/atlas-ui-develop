//const url = 'http://127.0.0.1:8002';
import {authHeaders} from "../../auth/actions";

const url = process.env.REACT_APP_API_URL;

const getAssignments = (assignments) => {
    return {
        type: 'GET_CPASSIGNMENTS',
        payload: assignments
    }
};

const getDetailedAssignments = (detailedAssignments, customer_id) => {
    return {
        type: 'GET_DETAILED_CPASSIGNMENTS',
        payload: {[customer_id]: detailedAssignments},
    }
};

const addCPAssignment = (assignment) => {
    return {
        type: 'ADD_CPASSIGNMENT',
        payload: assignment
    }
};

const updateCPAssignment = (assignment) => {
    return {
        type: 'UPDATE_CPASSIGNMENT',
        payload: assignment
    }
}

const deleteAssignment = (assignment) => {
    return {
        type: 'DELETE_CPASSIGNMENT',
        payload: assignment
    }
}

const getCustomersByLevel = (customers) => {
    return {
        type: 'GET_CUSTOMERS_BY_LEVEL',
        payload: customers
    }
};

const getProductsBySalesOrg = (products) => {
    return {
        type: 'GET_PRODUCTS_BY_SALES_ORG',
        payload: products
    }
};

export const getCPAssignments = () => {
    return dispatch => {
        return fetch(`${url}/api/v1/cpassignment/get_distinct/`, authHeaders())
            .then(r => r.json())
            .then(assignments => dispatch(getAssignments(assignments)))
            .catch(err => console.error(err))
    }
};

export const getDetailedCPAssignments = (customer_id) => {
    return dispatch => {
        return fetch(`${url}/api/v1/cpassignment/cpassignments/?customer=${customer_id}`, authHeaders())
            .then(r => r.json())
            .then(assignments => dispatch(getDetailedAssignments(assignments.results, customer_id)))
            .catch(err => console.error(err))
    }
};


export const postCPAssignment = (assignment) => {
    let valid_to = assignment.valid_to.toISOString().split('T')[0];
    let valid_from = assignment.valid_from.toISOString().split('T')[0];
    return dispatch => {
        return fetch(`${url}/api/v1/cpassignment/cpassignments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                customer: assignment.customer,
                product: assignment.product,
                valid_to: valid_to,
                valid_from: valid_from
            })
        })
            .then(r => r.json())
            .then(assignment => dispatch(addCPAssignment(assignment)))
            .catch(err => console.error(err))
    }
};

export const patchCPAssignment = (assignment_id, update) => {
    let valid_to = update.valid_to.toISOString().split('T')[0];
    let valid_from = update.valid_from.toISOString().split('T')[0];
    return dispatch => {
        return fetch(`${url}/api/v1/cpassignment/cpassignments/${assignment_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                customer: update.customer,
                product: update.product,
                valid_to: valid_to,
                valid_from: valid_from
            })
        })
            .then(r => r.json())
            .then(assignment => dispatch(updateCPAssignment(assignment)))
            .catch(err => console.error(err))
    }
}

export const deleteCPAssignment = (assignment) => {
    return dispatch => {
        return fetch(`${url}/api/v1/cpassignment/cpassignments/${assignment.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            }
        })
            .then((r) => dispatch(deleteAssignment(assignment)))
            .catch(err => console.error(err))
    }
};

export const loadCustomersByLevel = (level) => {
    return dispatch => {
        return fetch(`${url}/api/v1/customer/customers/?level=${level}&limit=50`, authHeaders())
            .then(r => r.json())
            .then(customers => dispatch(getCustomersByLevel(customers.results)))
            .catch(err => console.error(err))
    }
};

export const loadProductsBySalesOrg = (sales_org) => {
    return dispatch => {
        return fetch(`${url}/api/v1/product/products/?sales_org=${sales_org}&level=5&limit=50`, authHeaders())
            .then(r => r.json())
            .then(products => dispatch(getProductsBySalesOrg(products.results)))
            .catch(err => console.error(err))
    }
};
