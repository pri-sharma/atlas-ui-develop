import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import {Col, Row} from "antd";
import basicStyle from "../settings/basicStyle";
import * as configs from "../containers/News/config";
import ContentHolder from "../components/utility/contentHolder";
import {SimpleLineCharts} from "../containers/PerformanceMonitor/charts/";
import {CustomPieCharts, CustomBarCharts} from "./News/charts/";
import {Modal, Button, Card} from 'antd';
import {NewsModal} from "./News";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../redux/news/actions';
import { Carousel } from 'antd';
var createReactClass = require('create-react-class');

class dashboard extends Component {
  constructor(props) {
    super(props);
  }
    state = { visible: false, title:'', body:'', news_array: [{title:'News Feed', body:'No News to Display'}] };
    handleOk = () => {
        this.setState({
          visible: false,
        });
    };

    showModal(item) {
        this.setState({
            visible: true,
            title: item.title,
            body: item.body
        })
    }

    componentDidMount() {
        this.props.getNews();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.news){
            let news_array;
            if(nextProps.news.length>2){news_array = nextProps.news.slice(0,3)}
            else if(nextProps.news.length>1){news_array = nextProps.news.slice(0,2)}
            else if(nextProps.news.length===1){news_array = nextProps.news}
            else{news_array = [{title:'News Feed', body:'No News to Display'}]}
            this.setState({news_array})
        }
    }

    render() {
    const { rowStyle, colStyle, gutter } = basicStyle;
    return (
      <LayoutContentWrapper>
        <LayoutContent>
          <h1>ATLAS DASHBOARD HOME</h1>
          <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} xs={24} lg={24} style={colStyle}>
              <ContentHolder>
                   <Component2 iframe={iframe} />
              </ContentHolder>
          </Col>

        </Row>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={12} xs={24} style={colStyle}>
              <ContentHolder>
                <Carousel dots={false} draggable={true} autoplaySpeed={5000} autoplay={true} infinite={true}>
                    {this.state.news_array && this.state.news_array.map((item, i)=>
                        <div key={i}>
                            <Card title={ item.title} style={{ width: '100%' }} extra={<Button style={{borderRadius:20}} type={"link"} size={"small"} icon="info-circle">Info</Button>}>
                                <p style={{whiteSpace:"pre-line"}}>{item.body.length>100 ? item.body.substring(0, 100) + '...': item.body}</p>
                                <Button style={{borderRadius:2, float:"right"}} ghost type="primary" onClick={()=>this.showModal(item)}>More</Button>
                            </Card>
                        </div>
                    )}
                </Carousel>

                  {this.state.visible ? <NewsModal handleClose={this.handleOk} title={this.state.title} body={this.state.body}/> : null}
              </ContentHolder>
          </Col>
            <Col md={12} xs={24} style={colStyle}>
              <ContentHolder>
                <CustomBarCharts />
              </ContentHolder>
            </Col>
        </Row>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

// const mapStateToProps = state => {
//     return {
//         news: state.News.news,
//     }
// };
const Component2 = createReactClass({
  iframe: function () {
    return {
      __html: this.props.iframe
    }
  },

  render: function() {
    return (
      <div>
        <div dangerouslySetInnerHTML={ this.iframe() } />
      </div>
    );
  }
});
const iframe = '<iframe src="https://datastudio.google.com/embed/reporting/1awRp17uhsUTBAeEzeFbfpxtL9TpDb3Bg/page/XCv1"' +
    ' width="100%" height="300" ></iframe>';
const mapStateToProps= (state) => {
    return { ...state }  // Take it all
};


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getNews: actions.getNewsAction,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(dashboard)
