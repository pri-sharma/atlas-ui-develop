// const base_url = 'http://127.0.0.1:8080';
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_ATTRIBUTES_PENDING: 'GET_ATTRIBUTES_PENDING',
    GET_ATTRIBUTES_SUCCESS: 'GET_ATTRIBUTES_SUCCESS',
    GET_ATTRIBUTES_ERROR: 'GET_ATTRIBUTES_ERROR',
    ADD_ATTRIBUTES: 'ADD_ATTRIBUTES',
    UPDATE_ATTRIBUTES: 'UPDATE_ATTRIBUTES',

    getAttributesPending: () => {
        return {
            type: actions.GET_ATTRIBUTES_PENDING
        }
    },
    getAttributesSuccess: (attributes) => {
        return {
            type: actions.GET_ATTRIBUTES_SUCCESS,
            payload: attributes
        }
    },
    getAttributesError: (error) => {
        return {
            type: actions.GET_ATTRIBUTES_ERROR,
            error: error
        }
    },
    addAttributes: (attributes) => {
        return {
            type: actions.ADD_ATTRIBUTES,
            payload: attributes
        }
    },
    updateAttributes: (attributes) => {
        return {
            type: actions.UPDATE_ATTRIBUTES,
            payload: attributes
        }
    },
};

export const getAttributesAction = () => {
    return dispatch => {
        dispatch(actions.getAttributesPending());
        fetch(`${base_url}/api/v1/salesorgdefault/salesorgattribute/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getAttributesSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getAttributesError(error));
            })
    }
};

export const addAttributesAction = (attributes, values) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/salesorgdefault/salesorgattribute/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({"key":attributes.key , "value":values})
        })
            .then(res => res.json())
            .then(attributes => dispatch(actions.addAttributes(attributes)))
            .catch(err => console.error(err))
    }
};

export const updateAttributesAction = (attributes, attribute_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/salesorgdefault/salesorgattribute/${attribute_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(attributes)
        })
            .then(res => res.json())
            .then(news => dispatch(actions.updateAttributes(news)))
            .catch(err => console.error(err))
    }
};

export default actions;
