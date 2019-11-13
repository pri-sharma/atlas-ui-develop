import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import AttributesForm from '../components/Forms/AttributesForm';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import LayoutContent from '../components/utility/layoutContent'
import {connect} from 'react-redux';
import * as actions from '../redux/attributes/actions';
import ContentHolder from '../components/utility/contentHolder'
import {Button, Table, Pagination, Input} from "antd";

let customers = [];
let news = [];

class AttributeContainer extends Component {
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
                title: 'Attribute',
                dataIndex: 'title',
            },
            {
                title: 'Values',
                dataIndex: 'body',
            },
        ]
    }
    componentDidMount() {
        this.props.getAttributes();
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
        this.setState({
            all_news: nextProps.news
        })
    }

    render(){
        console.log(this.props.news)
        return(
            <LayoutContentWrapper style={{height: '100%'}}>
                <LayoutContent>
                    <h3>Attributes And Values</h3><br/>
                    <ContentHolder>
                        {this.state.all_news.length > 0 ? <Table rowKey='id' pagination={{ pageSize:10}} onRow={(record, rowIndex) => {
                            return {
                                onClick: () => this.handleClick(record, rowIndex)
                            };
                        }} dataSource={this.props.news} columns={this.columns} rowKey={record => record.id}/> : 'No Sales Org Defaults'}
                        <Button onClick={this.handleBtnClick}>Add Attribute</Button>
                        {this.state.showAssignment ? <AttributesForm type={"PATCH"} id={this.state.id} title={this.state.title} body={this.state.body} sales_org={this.state.sales_org} handleUpdate={this.handleUpdate} handleDelete={this.handleDelete} handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked && this.state.kind === 'Add Attribute' ? <AttributesForm kind={'POST'} handleClose={this.handleClose}/> : null}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        news: state.Attributes.attributes,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getAttributes: actions.getAttributesAction,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AttributeContainer)