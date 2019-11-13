// const base_url = 'http://127.0.0.1:8080';
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_SALES_ORG_DEFAULTS_PENDING: 'GET_SALES_ORG_DEFAULTS_PENDING',
    GET_SALES_ORG_DEFAULTS_SUCCESS: 'GET_SALES_ORG_DEFAULTS_SUCCESS',
    GET_SALES_ORG_DEFAULTS_ERROR: 'GET_SALES_ORG_DEFAULTS_ERROR',
    ADD_SALES_ORG_DEFAULTS: 'ADD_SALES_ORG_DEFAULTS',
    UPDATE_SALES_ORG_DEFAULTS: 'UPDATE_SALES_ORG_DEFAULTS',

    getSalesOrgDefaultPending: () => {
        return {
            type: actions.GET_SALES_ORG_DEFAULTS_PENDING
        }
    },
    getSalesOrgDefaultSuccess: (sales_org_default) => {
        return {
            type: actions.GET_SALES_ORG_DEFAULTS_SUCCESS,
            payload: sales_org_default
        }
    },
    getSalesOrgDefaultError: (error) => {
        return {
            type: actions.GET_SALES_ORG_DEFAULTS_ERROR,
            error: error
        }
    },
    addSalesOrgDefault: (sales_org_default) => {
        return {
            type: actions.ADD_SALES_ORG_DEFAULTS,
            payload: sales_org_default
        }
    },
    updateSalesOrgDefault: (sales_org_default) => {
        return {
            type: actions.UPDATE_SALES_ORG_DEFAULTS,
            payload: sales_org_default
        }
    },
};

export const getSalesOrgDefaultAction = () => {
    return dispatch => {
        dispatch(actions.getSalesOrgDefaultPending());
        fetch(`${base_url}/api/v1/user/user_settings/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getSalesOrgDefaultSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getSalesOrgDefaultError(error));
            })
    }
};

export const addSalesOrgDefaultAction = (sales_org_default) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/user/user_settings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(sales_org_default)
        })
            .then(res => res.json())
            .then(news => dispatch(actions.addSalesOrgDefault(news)))
            .catch(err => console.error(err))
    }
};

export const updateSalesOrgDefaultAction = (sales_org_default, sales_org_default_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/user/user_settings/${sales_org_default_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(sales_org_default)
        })
            .then(res => res.json())
            .then(news => dispatch(actions.updateSalesOrgDefault(news)))
            .catch(err => console.error(err))
    }
};

export default actions;
