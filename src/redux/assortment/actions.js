// const base_url = 'http://127.0.0.1:8080'; THIS WILL NOT WORK WHEN PUSHED TO THE CLOUD. YOU MUST USE REACT_APP_API_URL
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_ASSORTMENTS_PENDING: 'GET_ASSORTMENTS_PENDING',
    GET_ASSORTMENTS_SUCCESS: 'GET_ASSORTMENTS_SUCCESS',
    GET_ASSORTMENTS_ERROR: 'GET_ASSORTMENTS_ERROR',

    getAssortmentsPending: () => {
        return {
            type: actions.GET_ASSORTMENTS_PENDING
        }
    },
    getAssortmentsSuccess: (news) => {
        return {
            type: actions.GET_ASSORTMENTS_SUCCESS,
            payload: news
        }
    },
    getAssortmentsError: (error) => {
        return {
            type: actions.GET_ASSORTMENTS_ERROR,
            error: error
        }
    },
};

export const getAssortmentsAction = () => {
    return dispatch => {
        dispatch(actions.getAssortmentsPending());
        fetch(`${base_url}/api/v1/assortments/assortments/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getAssortmentsSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getAssortmentsError(error));
            })
    }
};


export default actions;
