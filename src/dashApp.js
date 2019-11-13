import React from 'react';
import {Provider} from 'react-redux';
import {history, store} from './redux/store';
import PublicRoutes from './router';
import {LocaleProvider} from 'antd';
import {IntlProvider} from 'react-intl';
import AppLocale from './languageProvider';
import config, {getCurrentLanguage} from './containers/LanguageSwitcher/config';
import Boot from './redux/boot';

const currentAppLocale =
    AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];

const DashApp = () => (
    <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
        >
            <Provider store={store}>
                <PublicRoutes history={history}/>
            </Provider>
        </IntlProvider>
    </LocaleProvider>
);
Boot()
    .then(() => DashApp())
    .catch(error => console.error(error));

export default DashApp;
export {AppLocale};
