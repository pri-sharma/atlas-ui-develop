//const base_url = 'http://127.0.0.1:8002';
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_ASSIGNMENTS_PENDING: 'GET_ASSIGNMENTS_PENDING',
    GET_ASSIGNMENTS_SUCCESS: 'GET_ASSIGNMENTS_SUCCESS',
    GET_ASSIGNMENTS_ERROR: 'GET_ASSIGNMENTS_ERROR',
    ADD_ASSIGNMENT: 'ADD_ASSIGNMENT',
    DELETE_ASSIGNMENT: 'DELETE_ASSIGNMENT',
    UPDATE_ASSIGNMENT: 'UPDATE_ASSIGNMENT',
    GET_CUSTOMERS_BY_LEVEL: 'GET_CUSTOMERS_BY_LEVEL:',
    GET_USERS: 'GET_USERS',
    GET_ROLES: 'GET_ROLES',
    GET_DETAILED_ASSIGNMENTS: 'GET_DETAILED_ASSIGNMENTS',

    getDetailedAssignments: (assignments, customer_id) => {
        return {
            type: actions.GET_DETAILED_ASSIGNMENTS,
            payload: {[customer_id]: assignments},
        }
    },
    getAssignmentsPending: () => {
        return {
            type: actions.GET_ASSIGNMENTS_PENDING
        }
    },
    getAssignmentsSuccess: (assignments) => {
        return {
            type: actions.GET_ASSIGNMENTS_SUCCESS,
            payload: assignments
        }
    },
    getAssignmentsError: (error) => {
        return {
            type: actions.GET_ASSIGNMENTS_ERROR,
            error: error
        }
    },
    addAssignment: (assignment) => {
        return {
            type: actions.ADD_ASSIGNMENT,
            payload: assignment
        }
    },
    deleteAssignment: (assignment) => {
        return {
            type: actions.DELETE_ASSIGNMENT,
            payload: assignment
        }
    },
    updateAssignment: (assignment) => {
        return {
            type: actions.UPDATE_ASSIGNMENT,
            payload: assignment
        }
    },
    getCustomersByLevel: (level) => {
        return {
            type: actions.GET_CUSTOMERS_BY_LEVEL,
            payload: level
        }
    },
    getUsers: (users) => {
        return {
            type: actions.GET_USERS,
            payload: users
        }
    },
    getRoles: (roles) => {
        return {
            type: actions.GET_ROLES,
            payload: roles
        }
    },
};

export const getAssignmentsAction = () => {
    return dispatch => {
        dispatch(actions.getAssignmentsPending());
        fetch(`${base_url}/api/v1/cuassignment/get_distinct/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getAssignmentsSuccess(res));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getAssignmentsError(error));
            })
    }
};


export const getDetailedCUAssignmentsAction = (customer_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/cuassignment/cuassignments/?customer=${customer_id}`, authHeaders())
            .then(r => r.json())
            .then(assignments => dispatch(actions.getDetailedAssignments(assignments.results,customer_id)))
            .catch(err => console.error(err))
    }
};

export const addAssignmentAction = (assignment) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/cuassignment/cuassignments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(assignment)
        })
            .then(res => res.json())
            .then(assignment => dispatch(actions.addAssignment(assignment)))
            .catch(err => console.error(err))
    }
};

export const updateAssignmentAction = (assignment) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/cuassignment/cuassignments/${assignment.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(assignment)
        })
            .then(res => res.json())
            .then(assignment => dispatch(actions.updateAssignment(assignment)))
            .catch(err => console.error(err))
    }
};

export const deleteAssignmentAction = (assignment) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/cuassignment/cuassignments/${assignment.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            }
        })
            .then(dispatch(actions.deleteAssignment(assignment)))
            .catch(err => console.error(err))
    }
};

export const getCustomersByLevelAction = (level) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customer/customers/?level=${level}&limit=50`, authHeaders())
            .then(res => res.json())
            .then(customers => dispatch(actions.getCustomersByLevel(customers.results)))
            .catch(err => console.error(err))
    }
};

export const getUsersAction = () => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/user/users/?limit=50`, authHeaders())
            .then(res => res.json())
            .then(users => dispatch(actions.getUsers(users.results)))
            .catch(err => console.error(err))
    }
};

export const getRolesActions = () => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/user/roles/`, authHeaders())
            .then(res => res.json())
            .then(roles => dispatch(actions.getRoles(roles)))
            .catch(err => console.error(err))
    }
};

export default actions;
