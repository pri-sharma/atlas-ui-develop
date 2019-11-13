import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import SalesOrgDefaultForm from '../components/Forms/SalesOrgDefaultForm';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import LayoutContent from '../components/utility/layoutContent'
import {connect} from 'react-redux';
import * as actions from '../redux/salesorgDefaults/actions';
import ContentHolder from '../components/utility/contentHolder'
import {Button, Table, Pagination, Input} from "antd";

class SalesorgDefaultContainer extends Component {
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
                dataIndex: 'key',
            },
            {
                title: 'Value',
                dataIndex: 'value',
            },
        ]
    }
    componentDidMount() {
        this.props.getSalesOrgDefaults();
    }

    state = {
        current: '',
        btnClicked: false,
        kind: '',
        all_sales_org_defaults: [],
        sales_org: '',
        key: '',
        value: '',
        key_value: '',
    };

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText
        })
    };

    handleClick = (sales_org_defaults='') => {
      this.setState({
          showAssignment: !this.state.showAssignment,
          id: sales_org_defaults.id,
          sales_org: sales_org_defaults.sales_org,
          key_value: sales_org_defaults.key,
          value: sales_org_defaults.value,
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
            all_sales_org_defaults: nextProps.sales_org_defaults
        })
    }

    render(){
        console.log(this.state.key, this.state.value,'render')
        return(
            <LayoutContentWrapper style={{height: '100%'}}>
                <LayoutContent>
                    <h3>Sales Org Defaults</h3><br/>
                    <ContentHolder>
                        {this.state.all_sales_org_defaults.length > 0 ? <Table rowKey='id' pagination={{ pageSize:10}} onRow={(record, rowIndex) => {
                            return {
                                onClick: () => this.handleClick(record, rowIndex)
                            };
                        }} dataSource={this.props.sales_org_defaults} columns={this.columns} rowKey={record => record.id}/> : 'No Sales Org Defaults'}
                        <Button onClick={this.handleBtnClick}>Add Defaults</Button>
                        {this.state.showAssignment ? <SalesOrgDefaultForm type={"PATCH"} id={this.state.id} attribute={this.state.key_value} value={this.state.value} sales_org={this.state.sales_org} handleUpdate={this.handleUpdate} handleDelete={this.handleDelete} handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked && this.state.kind === 'Add Defaults' ? <SalesOrgDefaultForm kind={'POST'} handleClose={this.handleClose}/> : null}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        sales_org_defaults: state.SalesOrgDefaults.sales_org_defaults,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getSalesOrgDefaults: actions.getSalesOrgDefaultAction,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesorgDefaultContainer)