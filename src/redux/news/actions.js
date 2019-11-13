// const base_url = 'http://127.0.0.1:8080'; THIS WILL NOT WORK WHEN PUSHED TO THE CLOUD. YOU MUST USE REACT_APP_API_URL
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_NEWS_PENDING: 'GET_NEWS_PENDING',
    GET_NEWS_SUCCESS: 'GET_NEWS_SUCCESS',
    GET_NEWS_ERROR: 'GET_NEWS_ERROR',
    ADD_NEWS: 'ADD_NEWS',
    UPDATE_NEWS: 'UPDATE_NEWS',

    getNewsPending: () => {
        return {
            type: actions.GET_NEWS_PENDING
        }
    },
    getNewsSuccess: (news) => {
        return {
            type: actions.GET_NEWS_SUCCESS,
            payload: news
        }
    },
    getNewsError: (error) => {
        return {
            type: actions.GET_NEWS_ERROR,
            error: error
        }
    },
    addNews: (news) => {
        return {
            type: actions.ADD_NEWS,
            payload: news
        }
    },
    updateNews: (news) => {
        return {
            type: actions.UPDATE_NEWS,
            payload: news
        }
    },
};

export const getNewsAction = () => {
    return dispatch => {
        dispatch(actions.getNewsPending());
        fetch(`${base_url}/api/v1/news/News/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getNewsSuccess(res.results));
                return res.results;
            })
            .catch(error => {
                dispatch(actions.getNewsError(error));
            })
    }
};

export const addNewsAction = (news) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/news/News/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(news)
        })
            .then(res => res.json())
            .then(news => dispatch(actions.addNews(news)))
            .catch(err => console.error(err))
    }
};

export const updateNewstAction = (news, news_id) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/news/News/${news_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(news)
        })
            .then(res => res.json())
            .then(news => dispatch(actions.updateNews(news)))
            .catch(err => console.error(err))
    }
};

export default actions;
