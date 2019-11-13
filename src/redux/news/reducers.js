import actions from './actions';

const initState = {
    users: [],
    customers: [],
    news: [],
    roles: [],
    pending: false,
    error: null,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.GET_NEWS_PENDING:
            return {
                ...state,
                pending: false
            };
        case actions.GET_NEWS_SUCCESS:
            return {
                ...state,
                pending: false,
                news: action.payload
            };
        case actions.GET_NEWS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        case actions.ADD_NEWS:
            return {
                ...state,
                news: [action.payload, ...state.news]
            };
        // case actions.DELETE_NEWS:
        //     return {
        //         ...state,
        //         news: state.news.filter(x => x.id !== action.payload.id)
        //     };
        case actions.UPDATE_NEWS:
            return {
                ...state,
                news: updateNews(action.payload, [...state.news])
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