// const base_url = 'http://127.0.0.1:8080'; THIS WILL NOT WORK WHEN PUSHED TO THE CLOUD. YOU MUST USE REACT_APP_API_URL
//const base_url = process.env.REACT_APP_API_URL;
//const base_url = 'http://aggrid-demo.mediaagility.com/BigQuery/api/View'
const base_url = 'http://127.0.0.1:8002'
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});
const userID = localStorage.getItem('UserID');

const actions = {
    GET_GRIDVIEW_STRUCTURE: 'GET_GRIDVIEW_STRUCTURE',
    GET_GRIDVIEW_STRUCTURE_SUCCESS: 'GET_GRIDVIEW_STRUCTURE_SUCCESS',
    GET_GRIDVIEW_STRUCTURE_ERROR: 'GET_GRIDVIEW_STRUCTURE_ERROR',

    GET_GRIDVIEW_STATE: 'GET_GRIDVIEW_STATE',
    GET_GRIDVIEW_STATE_SUCCESS: 'GET_GRIDVIEW_STATE_SUCCESS',
    GET_GRIDVIEW_STATE_ERROR: 'GET_GRIDVIEW_DATA_ERROR',

    GET_GRIDVIEW_DATA: 'GET_GRIDVIEW_DATA',
    GET_GRIDVIEW_DATA_SUCCESS: 'GET_GRIDVIEW_DATA_SUCCESS',
    GET_GRIDVIEW_DATA_ERROR: 'GET_GRIDVIEW_DATA_ERROR',

    GET_USER: 'GET_USER',
    GET_USER_SUCCESS: 'GET_USER_SUCCESS',
    GET_USER_ERROR: 'GET_USER_ERROR',

    getGridViewStructureSuccess: (structure) => {
        return {
            type: actions.GET_GRIDVIEW_STRUCTURE_SUCCESS,
            payload: structure
        }
    },
    getGridViewStructureError: (error) => {
        return {
            type: actions.GET_GRIDVIEW_STRUCTURE_ERROR,
            error: error
        }
    },
    getGridViewDataSuccess: (data) => {
        return {
            type: actions.GET_GRIDVIEW_DATA_SUCCESS,
            payload: data
        }
    },
    getGridViewDataError: (error) => {
        return {
            type: actions.GET_GRIDVIEW_DATA_ERROR,
            error: error
        }
    },
    getGridViewStateSuccess: (state) => {
        return {
            type: actions.GET_GRIDVIEW_STATE_SUCCESS,
            payload: state
        }
    },
    getGridViewStateError: (error) => {
        return {
            type: actions.GET_GRIDVIEW_STATE_ERROR,
            error: error
        }
    },
    getUserSuccess: (user) => {
        return {
            type: actions.GET_USER_SUCCESS,
            payload: user
        }
    },
    getUserError: (error) => {
        return {
            type: actions.GET_USER_ERROR,
            error: error
        }
    }

};
export const GetGridViewStructureAction = (id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/get_grid_structure/fetch_structure/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                view_id: id,
                user_id: "abc@colpal.com"
            })
        })
            .then(r => {
                return r.json()
            })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(actions.getGridViewStructureSuccess(res));
                return res;
            })
            .catch(error => {
                dispatch(actions.getGridViewStructureError(error));
            })
    }

};

export const GetGridViewStateAction = (id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/get_grid_state/fetch_state/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                user_id: id
            })
        })
            .then(r => {
                return r.json()
            })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(actions.getGridViewStateSuccess(res));
                return res;
            })
            .catch(error => {
                dispatch(actions.getGridViewStateError(error));
            })
    }

};

export const GetGridViewDataAction = (id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/get_report_data_bq/fetch_bq_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                user_id: "kevin_gordon@colpal.com"
            })
        })
            .then(r => {
                return r.json()
            })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(actions.getGridViewDataSuccess(res));
                return res;
            })
            .catch(error => {
                dispatch(actions.getGridViewDataError(error));
            })
    }

};

export const getUserInfoAction = () => {
    return dispatch => {
              fetch(`${base_url}/api/v1/userinfo/fetch_user_detail/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(actions.getUserSuccess(res));
                return res;
            })
            .catch(error => {
                dispatch(actions.getUserError(error));
            })
    }
};

export default actions;
