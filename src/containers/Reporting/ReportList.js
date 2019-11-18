import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper'
import ContentHolder from "../../components/utility/contentHolder";
import LayoutContent from '../../components/utility/layoutContent';

import { Col, Row } from "antd";


const dummyData = [
  { 'id': '0', 'reportName': 'CBR Reort' },
  { 'id': '1', 'reportName': 'CBR Reort Pull' },
];
class ReportList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    columnDefs: [],

  }

  async componentDidMount() {

  }

  renderReportList() {
    // return this.state.filteredViewList.map((view, index) => {
    //   return (<table><tbody><tr key={index}><td>{view.viewType}</td></tr></tbody></table>)
    // })
    return dummyData.map((rp, index) => {
      return (<table><tbody><tr key={index}><td> <a href={"/reportview?id=" + rp.id}>{rp.reportName}</a> </td></tr></tbody></table>)
    })

  }
  render() {
    return (
      <LayoutContentWrapper>
        <LayoutContent>
          <h1>Report List</h1>
          <Row>
            <Col>
              <ContentHolder>
                {this.renderReportList()}
              </ContentHolder>
            </Col> </Row>
        </LayoutContent>
      </LayoutContentWrapper>

    )

  }
}
const mapStateToProps = state => {
  return {
    gridviewstate: state.GridView.gridviewstate,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getGridViewState: actions.GetGridViewStateAction
  }, dispatch);
};
//export default (ReportList)
export default connect(mapStateToProps, mapDispatchToProps)(ReportList)