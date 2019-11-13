import React from 'react';
import Async from '../../helpers/asyncComponent';

const NewsModal = (props) => <Async load={import(/* webpackChunkName: "antd-newsModal" */ './newsModal')} componentProps={props} />;

export {
  NewsModal,
};