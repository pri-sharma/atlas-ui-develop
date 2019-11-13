import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import NewsForm from '../components/Forms/NewsForm';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import LayoutContent from '../components/utility/layoutContent'
import {connect} from 'react-redux';
import * as actions from '../redux/news/actions';
import ContentHolder from '../components/utility/contentHolder'
import {Button, Table, Pagination, Input} from "antd";

let customers = [];
let news = [];

class NewsContainer extends Component {
    constructor(props){
        super(props);
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: 'Sales Org',
                dataIndex: 'sales_org',
                key: 'sales_org',
                render: (value => value===null ? '' : value.sales_org + " - " +  value===null ? '' : value.description)
            },
            {
                title: 'Title',
                dataIndex: 'title',
            },
            {
                title: 'Body',
                dataIndex: 'body',
            },
        ]
    }
    componentDidMount() {
        this.props.getNews();
    }

    state = {
        current: '',
        btnClicked: false,
        kind: '',
        all_news: [],
        title: '',
        body: '',
        sales_org: ''

    }

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText
        })
    };

    handleClick = (news='') => {
      this.setState({
          showAssignment: !this.state.showAssignment,
          title: news.title,
          body: news.body,
          id: news.id,
          sales_org: news.sales_org
      })
    };

    handleDelete = (assignment) => {

        this.props.deleteAssignment(assignment);

        this.setState({
            showAssignment: false,
            current: '',
            btnClicked: false
        })
    };

    handleUpdate = (assignment) => {
        this.props.updateAssignment(assignment);
    };

    handleClose = () => {
        this.setState({
            btnClicked: false,
            showAssignment: this.state.showAssignment
        })
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.news)
        this.setState({
            all_news: nextProps.news
        })
    }

    render(){
        console.log(this.props.news)
        return(
            <LayoutContentWrapper style={{height: '100%'}}>
                <LayoutContent>
                    <h3>News</h3><br/>
                    <ContentHolder>
                        {this.state.all_news.length > 0 ? <Table rowKey='id' pagination={{ pageSize:10}} onRow={(record, rowIndex) => {
                            return {
                                onClick: () => this.handleClick(record, rowIndex)
                            };
                        }} dataSource={this.props.news} columns={this.columns} rowKey={record => record.id}/> : 'No News'}
                        <Button onClick={this.handleBtnClick}>Add News</Button>
                        {this.state.showAssignment ? <NewsForm type={"PATCH"} id={this.state.id} title={this.state.title} body={this.state.body} sales_org={this.state.sales_org} handleUpdate={this.handleUpdate} handleDelete={this.handleDelete} handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked && this.state.kind === 'Add News' ? <NewsForm kind={'POST'} handleClose={this.handleClose}/> : null}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        news: state.News.news,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getNews: actions.getNewsAction,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsContainer)