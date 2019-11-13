import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import CUAssignmentForm from '../components/Forms/CUAssignmentForm';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import LayoutContent from '../components/utility/layoutContent'
import IndividualCUAssignment from './IndividualCUAssignment'
import {connect} from 'react-redux';
import * as actions from '../redux/cuassignment/actions';
import ContentHolder from '../components/utility/contentHolder'
import {Button, Table} from "antd";
import { Pagination } from 'antd';


let customers = [];

class CUAssignmentContainer extends Component {
    constructor(props){
        super(props);
        this.columns = [
            {
                title: 'Sales Org',
                dataIndex: 'customer',
                key: 'sales_org',
                render: (value => value.sales_org.sales_org)
            },
            {
                title: 'Customer',
                dataIndex: 'customer',
                render: (value => value.customer_id)
            },
            {
                title: 'Description',
                dataIndex: 'customer',
                key: 'description',
                render: (value => value.description)
            },
            {
                title: '# of Assignments',
                dataIndex: 'count',
                // render: (value => count)
            }
        ]

    }
    componentDidMount() {
        this.props.getAssignments();
        this.props.getRoles();
    }

    state = {
        showAssignment: false,
        current: '',
        btnClicked: false,
        kind: ''

    }
    /**
     * Creates an object where the keys are unique customers and the values are those customer's assignments
     */
    byCustomer = () => {
        let assignments = {};
        if(this.props.assignments){
            this.props.assignments.forEach(assignment => {
                if(assignments[assignment.customer.id]){
                    assignments[assignment.customer.id] = assignments[assignment.customer.id].concat(assignment)
                } else {
                    assignments[assignment.customer.id] = [assignment]
                }
            });
            return assignments
        }
    };

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText === "Add New Assignment" ? 'POST' : 'PATCH'
        })
    };

    handleClick = (assignment='') => {
        this.setState({
          showAssignment: !this.state.showAssignment,
          current: assignment,
      })
    };

    // printAssignments = () => {
    //     let assignments;
    //     customers = [];
    //     if (this.props.assignments) {
    //         assignments = this.byCustomer();
    //         Object.values(assignments).forEach(v => {
    //             customers.push({customer: v[0].customer, assignment: v})
    //         });
    //     }
    //     return customers;
    // };


    handleDelete = (assignment) => {
        let count = this.props.assignments.find(a => a.customer.id === assignment.customer.id).count;
        this.setState({
            showAssignment: false,
            current: '',
            btnClicked: false
        })
        this.props.deleteAssignment(assignment);
    };

    handleUpdate = (assignment) => {
        this.props.updateAssignment(assignment);
    };

    handleClose = () => {
        this.setState({
            btnClicked: false,
            showAssignment: false
        })
    };

    render(){
        return(
            <LayoutContentWrapper style={{height: '100%'}}>
                <LayoutContent>
                    <h3>Customer User Assignment Maintenance</h3><br/>
                    <ContentHolder>
                            <Table pagination={{ pageSize:10}} onRow={(record, rowIndex) => {
                            return {
                                onClick: () => this.handleClick(record, rowIndex)
                            };
                        }} dataSource={this.props.assignments} columns={this.columns} rowKey={record => record.customer.id}/>
                        <Button onClick={this.handleBtnClick}>Add New Assignment</Button>
                        {this.state.showAssignment ? <IndividualCUAssignment assignment={this.state.current} roles={this.props.roles} handleUpdate={this.handleUpdate} handleDelete={this.handleDelete} handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked && this.state.kind === 'POST' ?
                            <CUAssignmentForm kind={'POST'} handleClose={this.handleClose}/> : null}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        assignments: state.CUAssignment.assignments,
        users: state.CUAssignment.users,
        customers: state.CUAssignment.customers,
        roles: state.CUAssignment.roles
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getAssignments: actions.getAssignmentsAction,
        addAssignment: actions.addAssignmentAction,
        deleteAssignment: actions.deleteAssignmentAction,
        updateAssignment: actions.updateAssignmentAction,
        getUsers: actions.getUsersAction,
        getCustomerByLevel: actions.getCustomersByLevelAction,
        getRoles: actions.getRolesActions,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CUAssignmentContainer)