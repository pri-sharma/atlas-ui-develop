//const base_url = 'http://127.0.0.1:8002';
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    SET_CUSTOMER: 'SET_CUSTOMER',
    SET_YEAR: 'SET_YEAR',
    SET_DATE_RANGE: 'SET_DATE_RANGE',
    GET_BVPS_PENDING: 'GET_BVPS_PENDING',
    GET_BVPS_SUCCESS: 'GET_BVPS_SUCCESS',
    GET_BVPS_ERROR: 'GET_BVPS_ERROR',
    SAVE_BVPS_PENDING: 'SAVE_BVPS_PENDING',
    SAVE_BVPS_SUCCESS: 'SAVE_BVPS_SUCCESS',
    SAVE_BVPS_ERROR: 'SAVE_BVPS_ERROR',
    GET_BVPS_FOR_PROMOS_SUCCESS: 'GET_BVP_FOR_PROMOS_SUCCESS',
    CHECK_CHANGE: 'CHECK_YEAR_CHANGE',
    NO_CHANGE: 'NO_YEAR_CHANGE',
    APPLY_SELECTIONS: 'APPLY_SELECTIONS',


    setSelectedCustomer: (customer) => {
        return {
            type: actions.SET_CUSTOMER,
            payload: customer
        }
    },
    setSelectedDates: (startDate, endDate) => {
        return {
            type: actions.SET_DATE_RANGE,
            payload: {startDate: startDate, endDate: endDate}
        }
    },
    getBvpsPending: () => {
        return {
            type: actions.GET_BVPS_PENDING
        }
    },
    getBvpsSuccess: (bvps) => {
        return {
            type: actions.GET_BVPS_SUCCESS,
            payload: bvps
        }
    },
    getBvpsError: (error) => {
        return {
            type: actions.GET_BVPS_ERROR,
            payload: error
        }
    },
    saveBvpsPending: (changedEntries) => {
        return {
            type: actions.SAVE_BVPS_PENDING,
            payload: changedEntries
        }
    },
    saveBvpsSuccess: (bvps) => {
        return {
            type: actions.SAVE_BVPS_SUCCESS,
            payload: bvps
        }
    },
    saveBvpsError: (error) => {
        return {
            type: actions.SAVE_BVPS_ERROR,
            payload: error
        }
    },
    checkChange: () => {
        return {
            type: actions.CHECK_CHANGE
        }
    },
    noChange: () => {
        return {
            type: actions.NO_CHANGE
        }
    },
    applyBVPSelections: (selections) => {
        return {
            type: actions.APPLY_SELECTIONS,
            payload: selections
        }
    }
};


export const setSelectedDatesAction = (startDateNew, endDateNew) => {
        return (dispatch, getState) => {
            const {startDate, endDate} = getState().Bvp;
            if  ((startDateNew && endDateNew !== endDate) || (endDateNew && startDateNew !== startDate)) { // only update dates if they have been changed
                dispatch(actions.setSelectedDates(startDateNew, endDateNew))
            }
        }
    }
;


export const getBvpsAction = (selections={}) => {
    let queryString = '';
    Object.keys(selections).forEach(key => {
        selections[key].forEach(value => {
            queryString += `&${key}=${value}`
        })
    });

    return (dispatch, getState) => {
        const {startDate, endDate, customer} = getState().Bvp;
        if (startDate && endDate) {
            dispatch(actions.applyBVPSelections(selections));
            dispatch(actions.getBvpsPending());
            return fetch(`${base_url}/api/v1/bvp/bvps/?customer=${customer}&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}${queryString}&limit=100000`, authHeaders()) //TODO do something about limit
                .then(r => r.json())
                .then(bvps => dispatch(actions.getBvpsSuccess(bvps)))
                .catch(err => dispatch(actions.getBvpsError(err)))
        }
        return Error('Start and End dates must be selected');
    }
};

export const saveBvpsAction = (changedEntries) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(actions.saveBvpsPending(changedEntries));
            fetch(`${base_url}/api/v1/bvp/save/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
                },
                body: JSON.stringify(changedEntries),
            })
                .then(r => r.json())
                .then(changed => {
                        dispatch(actions.saveBvpsSuccess(JSON.parse(changed)));
                        resolve(changed);
                    }
                )
                .catch(err => {
                    dispatch(actions.saveBvpsError(err));
                    reject(err);
                })
        });
    }
};


export const checkChange = () => {
    return dispatch => {
        dispatch(actions.checkChange());
    }
};

export const noChange = () => {
    return dispatch => {
        dispatch(actions.noChange());
    }
};

export default actions;
