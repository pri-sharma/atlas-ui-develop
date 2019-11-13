import actions from './actions';

const initState = {
    users: [],
    customers: [],
    attributes: [],
    roles: [],
    pending: false,
    error: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_ATTRIBUTES_PENDING:
            return {
                ...state,
                pending: false
            };
        case actions.GET_ATTRIBUTES_SUCCESS:
            return {
                ...state,
                pending: false,
                attributes: action.payload
            };
        case actions.GET_ATTRIBUTES_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.ADD_ATTRIBUTES:
            return {
                ...state,
                attributes: [action.payload, ...state.attributes]
            };
        // case actions.DELETE_NEWS:
        //     return {
        //         ...state,
        //         attributes: state.attributes.filter(x => x.id !== action.payload.id)
        //     };
        case actions.UPDATE_ATTRIBUTES:
            return {
                ...state,
                attributes: updateNews(action.payload, [...state.attributes])
            };
        default:
            return state;
    }
};

function updateNews(news, all_news) {
    all_news[all_news.findIndex(x => x.id === news.id)] = news;
    return all_news;
}

export default reducer;