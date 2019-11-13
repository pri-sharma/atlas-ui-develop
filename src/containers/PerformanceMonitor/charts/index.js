import React from 'react';
import Async from '../../../helpers/asyncComponent';

const SimpleLineCharts = (props) => <Async load={import(/* webpackChunkName: "rechartx-simpleLineCharts" */ './simpleLineCharts')} componentProps={props} />;
const CustomizedDotLineChart = (props) => <Async load={import(/* webpackChunkName: "rechartx-customizedDotLineChart" */ './customizedDotLineChart')} componentProps={props} />;

export {
  SimpleLineCharts,
  CustomizedDotLineChart,
};