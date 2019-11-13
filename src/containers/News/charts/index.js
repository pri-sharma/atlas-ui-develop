import React from 'react';
import Async from '../../../helpers/asyncComponent';

const CustomPieCharts = (props) => <Async load={import(/* webpackChunkName: "rechartx-customPieChart" */ './customPieChart')} componentProps={props} />;
const CustomBarCharts = (props) => <Async load={import(/* webpackChunkName: "reahartc-customBarChart" */ './customBarChart')} componentProps={{props}} />;

export {
  CustomPieCharts,
  CustomBarCharts,
};