// const base_url = 'http://127.0.0.1:8080';
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_GROUP_PENDING: 'GET_GROUP_PENDING',
    GET_GROUP_SUCCESS: 'GET_GROUP_SUCCESS',
    GET_GROUP_ERROR: 'GET_GROUP_ERROR',
    GET_USER_ROLES_PENDING: 'GET_USER_ROLES_PENDING',
    GET_USER_ROLES_SUCCESS: 'GET_USER_ROLES_SUCCESS',
    GET_USER_ROLES_ERROR: 'GET_USER_ROLES_ERROR',
    ADD_GROUP: 'ADD_GROUP',
    ADD_USER_ROLE: 'ADD_USER_ROLE',
    DELETE_GROUP: 'DELETE_GROUP',
    DELETE_USER: 'DELETE_USER',
    DELETE_CUSTOMER: 'DELETE_CUSTOMER',
    UPDATE_GROUP: 'UPDATE_GROUP',
    UPDATE_CUSTOMERS: 'UPDATE_CUSTOMERS',
    GET_USERS: 'GET_USERS',
    GET_CUSTOMERS_BY_SALESORG: 'GET_CUSTOMERS_BY_SALESORG',
    GET_SALESORG: 'GET_SALESORG',

    getGroupPending: () => {
        return {
            type: actions.GET_GROUP_PENDING
        }
    },
    getGroupSuccess: (group) => {
        return {
            type: actions.GET_GROUP_SUCCESS,
            payload: group
        }
    },
    getGroupError: (error) => {
        return {
            type: actions.GET_GROUP_ERROR,
            error: error
        }
    },
    getUserRolesPending: () => {
        return {
            type: actions.GET_USER_ROLES_PENDING,
        }
    },
    getUserRolesSuccess: (groupUserRoles) => {
        return {
            type: actions.GET_USER_ROLES_SUCCESS,
            payload: groupUserRoles
        }
    },
    getUserRolesError: (error) => {
        return {
            type: actions.GET_USER_ROLES_ERROR,
            error: error
        }
    },
    addGroup: (group) => {
        return {
            type: actions.ADD_GROUP,
            payload: group
        }
    },
    addUserRole: (userRole) => {
        return {
            type: actions.ADD_USER_ROLE,
            payload: userRole
        }
    },
    deleteGroup: (group) => {
        return {
            type: actions.DELETE_GROUP,
            payload: group
        }
    },
    deleteUser: (user) => {
        return {
            type: actions.DELETE_USER,
            payload: user
        }
    },
    deleteCustomer: (customer) => {
        return {
            type: actions.DELETE_CUSTOMER,
            payload: customer
        }
    },
    updateGroup: (group) => {
        return {
            type: actions.UPDATE_GROUP,
            payload: group
        }
    },
    updateCustomers: (customers) => {
        return {
            type: actions.UPDATE_CUSTOMERS,
            payload: customers
        }
    },
    getCustomersBySalesOrg: (salesOrg) => {
        return {
            type: actions.GET_CUSTOMERS_BY_SALESORG,
            payload: salesOrg
        }
    },
    getUsers: (users) => {
        return {
            type: actions.GET_USERS,
            payload: users
        }
    },
    getSalesOrgs: (salesOrg) => {
        return {
            type: actions.GET_SALESORG,
            payload: salesOrg
        }
    },
};

export const getGroupAction = () => {
    return dispatch => {
        dispatch(actions.getGroupPending());
        fetch(`${base_url}/api/v1/customergroup/customergroups/?limit=1000`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getGroupSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getGroupError(error));
            })
    }
};

export const getUserRolesAction = () => {
    return dispatch => {
        dispatch(actions.getUserRolesPending());
        fetch(`${base_url}/api/v1/customergroup/userroles/?limit=1000`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getUserRolesSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getUserRolesError(error));
            })
    }
};

export const addGroupAction = (group) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/customergroups/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(group)
        })
            .then(res => res.json())
            .then(group => dispatch(actions.addGroup(group)))
            .catch(err => console.error(err))
    }

};
export const addUserRoleAction = (userRole, group_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/userroles/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({'user': userRole.user,
                                        'role': userRole.role,
                                        'cg_id': group_id
            })
        })
            .then(res => res.json())
            .then(userRole => dispatch(actions.addUserRole(userRole)))
            .catch(err => console.error(err))
    }
};

export const updateGroupAction = (group, group_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/customergroups/${group_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')

            },
            body: JSON.stringify(group)
        })
            .then(res => res.json())
            .then(group => dispatch(actions.updateGroup(group)))
            .catch(err => console.error(err))
    }
};

export const updateCustomersAction = (customers, group_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/customergroups/${group_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')

            },
            body: JSON.stringify({'customers': customers,
                                        'update': 'customers'
            })
        })
            .then(res => res.json())
            .then(customers => dispatch(actions.updateCustomers(customers)))
            .catch(err => console.error(err))
    }
};

export const deleteGroupAction = (group) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/customergroups/${group.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            }
        })
            .then(dispatch(actions.deleteGroup(group)))
            .catch(err => console.error(err))
    }
};

export const deleteUserAction = (userrole_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/userroles/${userrole_id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
        })
            .then(dispatch(actions.deleteUser(userrole_id)))
            .catch(err => console.error(err))
    }
};

export const deleteCustomerAction = (customer, group_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customergroup/customergroups/${group_id}/remove/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({'customer': customer,
                                        'remove': 'customer'
            })
        })
            .then(dispatch(actions.deleteGroup(group_id)))
            .then(customer => dispatch(actions.deleteUser(customer)))
            .catch(err => console.error(err))
    }
};

export const getCustomersBySalesOrgAction = (salesOrg) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/customer/customers/?sales_org=${salesOrg}&limit=50`,  authHeaders())
            .then(res => res.json())
            .then(customers => dispatch(actions.getCustomersBySalesOrg(customers.results)))
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

export const getSalesOrgActions = () => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/core/salesorg/?limit=150`, authHeaders())
            .then(res => res.json())
            .then(salesOrg => dispatch(actions.getSalesOrgs(salesOrg.results)))
            .catch(err => console.error(err))
    }
};

export default actions;
