import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import PageHeader from "../../components/utility/pageHeader";
import {Col, Row} from "antd";
import Box from "../../components/utility/box";
import ContentHolder from "../../components/utility/contentHolder";
import {CustomizedDotLineChart, SimpleLineCharts} from "./charts/";
import basicStyle from "../../settings/basicStyle";
import * as configs from "./config";


export default class perfCharts extends Component {
  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <h1>PERFORMANCE DASHBOARD </h1>
        <PageHeader>Re-Charts</PageHeader>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={12} xs={24} style={colStyle}>
            <Box title={configs.SimpleLineCharts.title}>
              <ContentHolder>
                <SimpleLineCharts {...configs.SimpleLineCharts} />
              </ContentHolder>
            </Box>
          </Col>
          <Col md={12} xs={24} style={colStyle}>
            <Box title={configs.CustomizedDotLineChart.title}>
              <ContentHolder>
                <CustomizedDotLineChart {...configs.CustomizedDotLineChart} />
              </ContentHolder>
            </Box>
          </Col>
        </Row>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}
