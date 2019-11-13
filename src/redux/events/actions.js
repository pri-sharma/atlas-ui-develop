const url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_BSP_EVENTS: 'GET_BSP_EVENTS',
    ADD_BSP_EVENT: 'ADD_BSP_EVENT',
    UPDATE_BSP_EVENT: 'UPDATE_BSP_EVENT',
    DELETE_BSP_EVENT:'DELETE_BSP_EVENT',
    DELETE_BSP_PROD: 'DELETE_BSP_PROD',
    GET_TP_EVENTS: 'GET_TP_EVENTS',
    ADD_TP_EVENT: 'ADD_TP_EVENT',
    UPDATE_TP_EVENT: 'UPDATE_TP_EVENT',
    DELETE_TP_EVENT: 'DELETE_TP_EVENT',
    DELETE_TP_PROD: 'DELETE_TP_PROD',
    GET_PLANNABLE_PRODUCTS_ERROR: 'GET_PLANNABLE_PRODUCTS_ERROR',
    GET_PLANNABLE_PRODUCTS: 'GET_PLANNABLE_PRODUCTS',
    GET_PLANNABLE_PRODUCTS_PENDING: 'GET_PLANNABLE_PRODUCTS_PENDING',
    GET_FILTERED_PRODUCTS: 'GET_FILTERED_PRODUCTS',
    GET_TACTICS: 'GET_TACTICS',
    CHANGE_CURRENT_EVENT: 'CHANGE_CURRENT_EVENT',
    SET_CURRENT_EVENT: 'SET_CURRENT_EVENT',
    SET_SELECTED_CUSTOMER: 'SET_SELECTED_CUSTOMER',
    GET_TP_CONDITIONS: 'GET_TP_CONDITIONS',
    GET_BSP_CONDITIONS: 'GET_BSP_CONDITIONS',
    CREATE_TP_FAILED: 'CREATE_TP_FAILED',
    RESET_CREATE_TP_SUCCESS: 'RESET_CREATE_TP_SUCCESS',
    GET_EVENT_SELECTION_OPTIONS: 'GET_EVENT_SELECTION_OPTIONS',
    GET_EVENT_PENDING: 'GET_EVENT_PENDING',
    GET_EVENT_ERROR: 'GET_EVENT_ERROR',
    SET_TP_SELECTED_OPTIONS: 'SET_TP_SELECTED_OPTIONS',
    SET_BSP_SELECTED_OPTIONS: 'SET_BSP_SELECTED_OPTIONS',
    STORE_GRID_CHANGES: 'STORE_GRID_CHANGES',
    UPDATE_EVENT_CHANGES: 'UPDATE_EVENT_CHANGES',
    SAVE_EVENT_GRID_CHANGES_SUCCESS: 'SAVE_EVENT_GRID_CHANGES_SUCCESS',
    GET_EVENTS_SELECTED_COPY: 'GET_EVENTS_SELECTED_COPY',
    COPIED_TP_EVENTS: 'COPIED_TP_EVENTS',
    COPIED_BSP_EVENTS: 'COPIED_BSP_EVENTS',


    createTPEventFailure: (message) => {
        return {
            type: 'CREATE_TP_FAILED',
            payload: message
        }
    },
    getBSEvents: (events) => {
        return {
            type: 'GET_BSP_EVENTS',
            payload: events
        }
    },
    addBSEvent: (event) => {
        return {
            type: 'ADD_BSP_EVENT',
            payload: event
        }
    },
    updateBSEvent: (event) => {
        return {
            type: 'UPDATE_BSP_EVENT',
            payload: event
        }
    },
    deleteBSEvent: (event_id) => {
        return {
            type: 'DELETE_BSP_EVENT',
            payload: event_id
        }
    },
    deleteBSProd: (products) => {
        return {
            type: 'DELETE_BSP_PROD',
            payload: products
        }
    },
    getTPEvents: (events) => {
        return {
            type: 'GET_TP_EVENTS',
            payload: events
        }
    },
    addTPEvent: (event) => {
        return {
            type: 'ADD_TP_EVENT',
            payload: event
        }
    },
    patchTPEvent: (event) => {
        return {
            type: 'UPDATE_TP_EVENT',
            payload: event
        }
    },
    deleteTPEvent: (event_id) => {
        return {
            type: 'DELETE_TP_EVENT',
            payload: event_id
        }
    },
    deleteTPProd: (products) => {
        return {
            type: 'DELETE_TP_PROD',
            payload: products
        }
    },
    getProductsSuccess: (products) => {
        return {
            type: 'GET_PLANNABLE_PRODUCTS',
            payload: products
        }
    },
    getProductsError: (error) => {
        return {
            type: 'GET_PLANNABLE_PRODUCTS_ERROR',
            payload: error
        }
    },
    getProductsPending: () => {
        return {
            type: 'GET_PLANNABLE_PRODUCTS_PENDING'
        }
    },
    getFilteredProducts: (selected_products) => {
        return{
            type: 'GET_FILTERED_PRODUCTS',
            payload: selected_products
        }
    },
    getEventTactics: (tactics) => {
        return {
            type: 'GET_TACTICS',
            payload: tactics
        }
    },
    getTPConditions: (conditions) => {
        return {
            type: 'GET_TP_CONDITIONS',
            payload: conditions
        }
    },
    getBSPConditions: conditions => {
        return {
            type: 'GET_BSP_CONDITIONS',
            payload: conditions
        }
    },
    getEventSelectionOptions: (options) => {
        return {
            type: 'GET_EVENT_SELECTION_OPTIONS',
            payload: options,
        }
    },
    getEventPending: () => {
        return {
            type: 'GET_EVENT_PENDING'
        }
    },
    getEventError: (err) => {
        return {
            type: 'GET_EVENT_ERROR',
            payload: err
        }
    },
    setTPSelectedOptions: filters => {
        return {
            type: 'SET_TP_SELECTED_OPTIONS',
            payload: filters
        }
    },
    setBSPSelectedOptions: filters => {
        return {
            type: 'SET_BSP_SELECTED_OPTIONS',
            payload: filters
        }
    },
    setCurrentEvent: (event) => {
        return {
            type: 'SET_CURRENT_EVENT',
            payload: event
        }
    },
    storeGridChanges: (changedEntries) => {
        return {
            type: 'STORE_GRID_CHANGES',
            payload: changedEntries
        }
    },
    updateEventChanges: (changes) => {
        return {
            type: 'UPDATE_EVENT_CHANGES',
            payload: changes
        }
    },
    saveEventGridChangesSuccess: (changed) => {
        return {
            type: 'SAVE_EVENT_GRID_CHANGES_SUCCESS',
            payload: changed
        }
    },

    copyTPEvents: (events) => {
        return {
            type: 'COPIED_TP_EVENTS',
            payload: events
        }
    },
    copyBSPEvents: (events) => {
        return {
            type: 'COPIED_BSP_EVENTS',
            payload: events
        }
    },
};

export const getEvents = (event_type, customer_id, filters={}) => {
    let queryString = '';
    Object.keys(filters).forEach(key => {
        filters[key].forEach(value => {
            queryString += `&${key}=${value}`
        })
    });

    return dispatch => {
        event_type === 'TP' ? dispatch(actions.setTPSelectedOptions(filters)) : dispatch(actions.setBSPSelectedOptions(filters));
        return fetch(`${url}/api/v1/event/shallowevents/?type=${event_type}&customer=${customer_id}&limit=1000${queryString}`, authHeaders()) //TODO: whats the filter?
            .then(r => r.json())
            .then(events => {
                if(event_type === 'BSP'){
                    return dispatch(actions.getBSEvents(events.results))
                } else {
                    return dispatch(actions.getTPEvents(events.results))
                }
            })
            .catch(err => console.log(err))
    }
};

export const getEventSelectionOptionsAction = (event_type, customer_id) => {
    return dispatch => {
        if(customer_id) {
            return fetch(`${url}/api/v1/event/geteventselectionoptions/?customer_id=${customer_id}&event_type=${event_type}`, authHeaders())
                .then(r => r.json())
                .then(options => dispatch(actions.getEventSelectionOptions(options)))
                .catch(err => console.log(err))
        }
    }
};

export const getBvpOptions = () => {
    return (dispatch, getState) => {
        const {startDate, endDate, customer} = getState().Bvp;
        if (startDate && endDate){
            return fetch(`${url}/api/v1/bvp/getbvpselectionoptions/?customer_id=${customer}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, authHeaders())
                .then(r => r.json())
                .then(options => dispatch(actions.getEventSelectionOptions(options)))
                .catch(err => console.log(err))
        }
    }
};

export const createBSPEvent = (event) => {
    let pricing_start = event.pricing_start.toISOString().split('T')[0];
    let pricing_end = event.pricing_end.toISOString().split('T')[0];
    let calyear = pricing_start.split('-')[0];
    let products = event.products.map(product => product.id.toString());
    let customer = typeof event.customer === 'number' ? event.customer : event.customer.id;

    return dispatch => {
        return fetch(`${url}/api/v1/event/events/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                customer: customer,
                products: products,
                pricing_start: pricing_start,
                pricing_end: pricing_end,
                type: 'BSP',
                description: event.description,
                calyear: calyear
            })
        })
            .then(r => {
                return r.json()
            })
            .then(event => dispatch(actions.addBSEvent(event)))
            .catch(err => console.log(err))
    }
};

export const updateBSPEvent = (event, event_id) => {

    let pricing_end, pricing_start;

    if(typeof(event.pricing_end) === 'object'){
        pricing_end = event.pricing_end.toISOString().split('T')[0];
    } else {
        pricing_end = event.pricing_end
    }
    if (typeof(event.pricing_start) === 'object'){
        pricing_start = event.pricing_start.toISOString().split('T')[0];
    } else {
        pricing_start = event.pricing_start
    }
    let customer = typeof event.customer === 'number' ? event.customer : event.customer.id;

    return dispatch => {
        return fetch(`${url}/api/v1/event/events/${event_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                customer: customer,
                products: event.products,
                pricing_start: pricing_start,
                pricing_end: pricing_end,
                description: event.description,
                status: event.status
            })
        })
            .then(r => r.json())
            .then(event => dispatch(actions.updateBSEvent(event)))
            .catch(err => console.log(err))
    }
};

export const deleteEvent = (event_id, event_type) => {
    return dispatch => {
        return fetch(`${url}/api/v1/event/events/${event_id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            }
        })
            .then(() => {
                if(event_type === 'BSP'){
                    return dispatch(actions.deleteBSEvent(event_id))
                } else {
                    return dispatch(actions.deleteTPEvent(event_id))
                }
            })
    }
};

export const createTPEvent = (event) => {
    let dates = {};
    ['sellout_start', 'sellout_end', 'pricing_start', 'pricing_end', 'ship_start', 'ship_end'].forEach(date => {
        dates[date] = event[date].toISOString().split('T')[0]
    });
    let calyear = dates['pricing_start'].split('-')[0];

    let customer = typeof event.customer === 'number' ? event.customer : event.customer.id;
    let products = event.products.map(product => product.id.toString());
    let conditions = event.conditions.map(condition => condition.id.toString());
    let tactics = event.tactics.map(tactic => tactic.id.toString());
    return dispatch => {
        return fetch(`${url}/api/v1/event/events/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                customer: customer,
                products: products,
                calyear: calyear,
                pricing_start: dates['pricing_start'],
                pricing_end: dates['pricing_end'],
                sellout_start: dates['sellout_start'],
                sellout_end: dates['sellout_end'],
                ship_start: dates['ship_start'],
                ship_end: dates['ship_end'],
                type: 'TP',
                status: event.status,
                description: event.description,
                conditions: conditions,
                tactics: tactics,
            })
        })
            .then(r => r.json())
            .then(event => {
                typeof event !== 'string' ? dispatch(actions.addTPEvent(event)) : dispatch(actions.createTPEventFailure(event))
            })
            .catch(err => console.log(err))
    }
};

export const updateEventStatus = (event_id, newStatus) => { //TODO remove this and merge it with what happens with Ly's code
    return dispatch => {
        return fetch(`${url}/api/v1/event/events/${event_id}/`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('idToken')
            },
            body: JSON.stringify({status: newStatus})
        })
            .then(r =>r.json())
            .catch(err => console.log(err))
    }
};

export const updateEventPricingLevel = (event_prod_id, newLevel) => { //TODO remove this and merge it with what happens with Ly's code
    return dispatch => {
        return fetch(`${url}/api/v1/event/eventproducts/${event_prod_id}/`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('idToken')
            },
            body: JSON.stringify({pricing_level: newLevel})
        })
            .then(r =>r.json())
            .catch(err => console.log(err))
    }
};

export const deleteEventProduct = (event_prod_id, event_type) => { //TODO remove this and merge it with what happens with Ly's code
    return dispatch => {
        return fetch(`${url}/api/v1/event/eventproducts/${event_prod_id}/`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('idToken')
            }
        })
            .then(() => {
                if(event_type === 'BSP'){
                    return dispatch(actions.deleteBSProd(event_prod_id))
                } else {
                    return dispatch(actions.deleteTPProd(event_prod_id))
                }
            })
            .catch(err => console.log(err))
    }
};

export const storeGridChanges = (changedEntries) => {
    return dispatch => dispatch(actions.storeGridChanges(changedEntries))
};

export const updateEventChanges = (changes) => {
    return dispatch => dispatch(actions.updateEventChanges(changes))
};

export const updateTPEvent = (event) => {
    return dispatch => {
        return fetch(`${url}/api/v1/event/events/${event.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('idToken')
            },
            body: JSON.stringify(event)
        })
            .then(r =>r.json())
            .then(event => dispatch(actions.patchTPEvent(event)))
            .catch(err => console.log(err))
    }
};

export const getPlannableProducts = (customer_id) => {
    return dispatch => {
        dispatch(actions.getProductsPending());
        return fetch(`${url}/api/v1/assortments/plannableproducts/?customer=${customer_id}`, authHeaders())
            .then(r => r.json())
            .then(products => dispatch(actions.getProductsSuccess(products)))
            .catch(err => dispatch(actions.getProductsError(err)))
    }
};

export const getFilteredProducts = (selections) => {
    return dispatch => dispatch(actions.getFilteredProducts(selections))
};


export const getTactics = () => {
    return dispatch => {
        return fetch(`${url}/api/v1/event/tactics/`, authHeaders())
            .then(r => r.json())
            .then(tactics => dispatch(actions.getEventTactics(tactics.results)))
            .catch(err => console.log(err))
    }
};

export const getConditions = (eventType) => {
    return (dispatch, getState) => {
        const salesorg = getState().SalesOrg.salesorg;
        if(salesorg){
            return fetch(`${url}/api/v1/pricing/conditions/?source=${eventType}&sales_org=${salesorg}`, authHeaders())
                .then(r => r.json())
                .then(conditions => {
                    if(eventType === 'TP'){
                        return dispatch(actions.getTPConditions(conditions.results))
                    }
                    return dispatch(actions.getBSPConditions(conditions.results))
                })
                .catch(err => console.log(err))
        }

    }
};

export const saveEventGridChanges = (changedEntries) => { //Right now this only takes the values of total volume, and it will calculate uplift on the backend
    return dispatch => {
        return new Promise((resolve, reject) => {
            fetch(`${url}/api/v1/event/eventproducts/save/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
                },
                body: JSON.stringify(changedEntries)
            })
                .then(r => r.json())
                .then(changed => {
                    dispatch(actions.saveEventGridChangesSuccess(JSON.parse(changed)));
                    resolve(changed)
                })
                .catch(err => reject(err))
        })
    }
};

export const getCurrentEvent = (eventId) => {
    return dispatch => {
        dispatch(actions.getEventPending());
        return fetch(`${url}/api/v1/event/events/?id=${eventId}`, authHeaders())
            .then(r => r.json())
            .then(event => {
                dispatch(actions.setCurrentEvent(event.results[0]));
                // dispatch(plannableCustomerActions.setSelectedCustomerAction(event.results[0].eventcustomers_set[0].customer.id));
            })
            .catch(err => dispatch(actions.getEventError(err)))
    }
};

export const resetCreateTPSuccess = () => {
    return dispatch => (dispatch({
        type: 'RESET_CREATE_TP_SUCCESS'
    }))
};


export const copyEvent = (event_id, event_type, increment, level, copies) => {
    return dispatch => {
        dispatch(actions.getEventPending());
        return fetch(`${url}/api/v1/event/copy_event/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                id: event_id,
                type: event_type,
                increment: increment,
                level: level,
                copies: copies

             })
        })
            .then(r => r.json())
            .then( events => {
                if(event_type === 'BSP'){
                    return dispatch(actions.copyBSPEvents(events))
                } else {
                    return dispatch(actions.copyTPEvents(events))
                }
            })
            .catch(err => console.log(err))
    }
};

export default actions;

