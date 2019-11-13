// const base_url = 'http://127.0.0.1:8080';
const base_url = process.env.REACT_APP_API_URL;
const authHeaders = () => ({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
});

const actions = {
    GET_USER_SETTINGS: 'GET_USER_SETTINGS',
    GET_USER_SETTINGS_PENDING: 'GET_USER_SETTINGS_PENDING',
    GET_LANGUAGES_PENDING: 'GET_LANGUAGES_PENDING',
    GET_LANGUAGES: 'GET_LANGUAGES',
    SAVE_USER_SETTINGS: 'SAVE_USER_SETTINGS',

    getUserSettings: (settings) => {
        return{
            type: actions.GET_USER_SETTINGS,
            payload: settings
        }
    },

    getUserSettingsPending: () => {
        return {
            type: actions.GET_USER_SETTINGS_PENDING
        }
    },


    getLanguagesPending: () => {
        return {
            type: actions.GET_LANGUAGES_PENDING
        }
    },

    getLanguages: (languages) => {
        return{
            type: actions.GET_LANGUAGES,
            payload: languages
        }
    },

    saveUserSettings: (user_settings) => {
      return{
          type: actions.SAVE_USER_SETTINGS,
          payload: user_settings
      }
    },
};


export const getUserSettingsAction = () => {
    return dispatch => {
        dispatch(actions.getUserSettingsPending());
        fetch(`${base_url}/api/v1/user/corresponding_user/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getUserSettings(res));
                return res;
            })
            .catch(error => {
                console.log("getUserSettings Error", error)
            })
    }
};


export const getLanguageListAction = () => {
    return dispatch => {
        dispatch(actions.getLanguagesPending());
        fetch(`${base_url}/api/v1/product/languages/`, authHeaders())
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(actions.getLanguages(res));
                return res;
            })
            .catch(error => {
                console.log("getLanguages Error", error)
            })
    }
};


export const addUserSettings = (settings) => {
    return dispatch => {
        return fetch(`${base_url}/api/v1/user/user_settings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify(settings)
        })
            .then(res => res.json())
            .then(settings => dispatch(actions.saveUserSettings(settings)))
            .catch(err => console.error(err))
    }
};

export default actions;
