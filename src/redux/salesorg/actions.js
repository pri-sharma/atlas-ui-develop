const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});


const actions = {
    FETCH_SALESORGS_PENDING: 'FETCH_SALESORGS_PENDING',
    FETCH_SALESORGS_SUCCESS: 'FETCH_SALESORGS_SUCCESS',
    FETCH_SALESORGS_ERROR: 'FETCH_SALESORGS_ERROR',
    SET_SALESORG: 'SET_SALESORG',

    fetchSalesOrgsPending: () => {
        return {
            type: actions.FETCH_SALESORGS_PENDING
        }
    },
    fetchSalesOrgsSuccess: (salesorgs) => {
        return {
            type: actions.FETCH_SALESORGS_SUCCESS,
            salesorgs: salesorgs
        }
    },
    fetchSalesOrgsError: (error) => {
        return {
            type: actions.FETCH_SALESORGS_ERROR,
            error: error
        }
    },
    setSalesOrg: (salesorg) => {
        return {
            type: actions.SET_SALESORG,
            payload: salesorg
        }
    },

    CHANGE_SALESORG: 'CHANGE_SALESORG',

    changeSalesOrg: (sorg) => {
        return {
            type: actions.CHANGE_SALESORG,
            salesorg: sorg
        }
    },
};

export const setSelectedSalesOrg = (customer_id) => {
    return dispatch => {
        fetch(`${base_url}/api/v1/customer/getsalesorgbycustomer/?customer_id=${customer_id}`, authHeaders())
            .then(r => r.json())
            .then(res => dispatch(actions.setSalesOrg(res)))
    }
};

export const fetchSalesOrgsAction = () => {
    return dispatch => {
        dispatch(actions.fetchSalesOrgsPending());
        fetch(`${base_url}/api/v1/core/salesorg/?limit=1000`, {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("idToken")
            }})
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.fetchSalesOrgsSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.fetchSalesOrgsError(error));
            })
    }
};

export const changeSalesOrgAction = (sorg) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/core/salesorg/${sorg.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sorg)
        })
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.changeSalesOrg(sorg));
                return res;
            })
            .catch(err => console.error(err))
    };
};

export default actions;
