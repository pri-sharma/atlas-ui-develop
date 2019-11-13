import actions from './actions';

const initState = {
    baselineVolumePlans: [],
    bvpLoadPending: true,
    changedEntries: {},
    customer: null,
    startDate: null,
    endDate: null,
    pendingGet: false,
    pendingSave: false,
    errorGet: null,
    errorSave: null,
    ifChanged: false,
    applyBVPSelections: false,
    bvpSelectedOptions: {
        category: [],
        subcategory: [],
        subbrand: [],
        ppg: [],
        sku: [],
    },
};

const reducer = (prevState = initState, action) => {
    switch (action.type) {
        case actions.APPLY_SELECTIONS:
            return {
                ...prevState,
                bvpSelectedOptions: action.payload,
                applyBVPSelections: true
            };
        case actions.NO_CHANGE:
            return{
                ...prevState,
                ifChanged: false
            };
        case actions.CHECK_CHANGE:
            return {
                ...prevState,
                ifChanged: true
            };
        case actions.SET_CUSTOMER:
            const newState1 = {
                ...prevState,
                customer: action.payload
            };
            if (prevState.startDate && prevState.endDate && prevState.customer !== action.payload)
            {
                newState1.bvpLoadPending = true;
            }
            return newState1;
        case actions.SET_DATE_RANGE:
            let newState2 = {
                ...prevState,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate
            };
            if (action.payload.startDate && action.payload.endDate && prevState.customer)
            {
                newState2.bvpLoadPending = true;
            }
            return newState2;
        case actions.GET_BVPS_PENDING:
            return {
                ...prevState,
                pendingGet: true
            };
        case actions.GET_BVPS_SUCCESS:
            return {
                ...prevState,
                pendingGet: false,
                baselineVolumePlans: action.payload,
                bvpLoadPending: false,
            };
        case actions.GET_BVPS_ERROR:
            return {
                ...prevState,
                pendingGet: false,
                errorGet: action.payload,
                baselineVolumePlans: [],
                bvpLoadPending: false,
            };
        case actions.SAVE_BVPS_PENDING:
            return {
                ...prevState,
                pendingSave: true,
                changedEntries: action.payload
            };
        case actions.SAVE_BVPS_SUCCESS:
            return {
                ...prevState,
                pendingSave: false,
                baselineVolumePlans: updateBvp(prevState.baselineVolumePlans, action.payload),
                changedEntries: {}
            };
        case actions.SAVE_BVPS_ERROR:
            return {
                ...prevState,
                pendingSave: false,
                errorSave: action.payload
            };
        default:
            return prevState;
    }
};

const updateBvp = (bvps, changed) => { // TODO potential performance issue, either make this a map or sort and binary search
    return bvps.map(bvp => {
        if (changed.hasOwnProperty(bvp.id)) {
            bvp[changed[bvp.id]['calyear']] = changed[bvp.id];
        }
        return bvp;
    });
};

export default reducer;