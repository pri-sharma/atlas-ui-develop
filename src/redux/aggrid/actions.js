// const base_url = 'http://127.0.0.1:8080'; THIS WILL NOT WORK WHEN PUSHED TO THE CLOUD. YOU MUST USE REACT_APP_API_URL
//const base_url = process.env.REACT_APP_API_URL;
const base_url = 'http://aggrid-demo.mediaagility.com/BigQuery/api/View'
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_GRIDVIEW_STRUCTURE: 'GET_GRIDVIEW_STRUCTURE',
    GET_GRIDVIEW_DATA: 'GET_GRIDVIEW_DATA',
    GET_GRIDVIEW_STRUCTURE_SUCCESS: 'GET_GRIDVIEW_STRUCTURE_SUCCESS',
    GET_GRIDVIEW_STRUCTURE_ERROR: 'GET_GRIDVIEW_STRUCTURE_ERROR',
    GET_GRIDVIEW_DATA_SUCCESS: 'GET_GRIDVIEW_DATA_SUCCESS',
    GET_GRIDVIEW_DATA_ERROR: 'GET_GRIDVIEW_DATA_ERROR',

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
    }

};
export const GetGridViewStructureAction = () => {
    return dispatch => {
        // dispatch(actions.getAssortmentsPending());
        fetch(`${base_url}/GetGridViewStructure/`)
            .then(res => res.json())
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

export const GetGridViewDataAction = (id) => {
    return dispatch => {
        // dispatch(actions.getAssortmentsPending());
        fetch(`${base_url}/GetGridViewData?data=`+id)
            .then(res => res.json())
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
export default actions;
