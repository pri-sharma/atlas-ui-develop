import React, {Component} from 'react';
import CPAssignmentForm from '../components/Forms/CPAssignmentForm';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import LayoutContent from '../components/utility/layoutContent'
import IndividualCPAssignment from './IndividualCPAssignment'
import {connect} from 'react-redux';
import * as actions from '../redux/app/actions/cpassignments';
import PageHeader from '../components/utility/pageHeader'
import ContentHolder from '../components/utility/contentHolder'
import {Button, Table} from "antd";
import {Pagination} from 'antd';


class CPAssignmentContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showAssignment: false,
            current: '',
            btnClicked: false,
            kind: 'POST',
        };

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
            }
        ];
    }

    componentWillMount() {
        this.props.getCPAssignments();
    }

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText === "Add New Assignment" ? 'POST' : 'PATCH'
        })
    };

    handleClick = (assignment = '') => {
        this.setState({
            showAssignment: !this.state.showAssignment,
            current: assignment
        })
    };

    handleDelete = (assignment) => {
        let count = this.props.assignments.find(a => a.customer.id === assignment.customer.id).count;
        if (count <= 1) {
            this.setState({
                showAssignment: false,
                current: '',
                btnClicked: false
            })
        }
        this.props.deleteCPAssignment(assignment);
    };

    handleClose = () => {
        this.setState({
            btnClicked: false
        })
    };

    render() {
        return (
            <LayoutContentWrapper style={{height: '100%'}}>
                <LayoutContent>
                    <PageHeader>Customer Product Assignments</PageHeader>
                    <ContentHolder>
                        <Table pagination={{pageSize: 10}}
                               onRow={(record, rowIndex) => ({onClick: () => this.handleClick(record, rowIndex)})}
                               dataSource={this.props.assignments}
                               columns={this.columns}
                               rowKey={record => record.customer.id}/>
                        <Button onClick={this.handleBtnClick}>Add New Assignment</Button>
                        {this.state.showAssignment ?
                            <IndividualCPAssignment assignment={this.state.current}
                                                    handleDelete={this.handleDelete}
                                                    handleClose={this.handleClick}/>
                            : null}
                        {this.state.btnClicked && this.state.kind === 'POST' ?
                            <CPAssignmentForm kind={'POST'} handleClose={this.handleClose}/>
                            : null}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        assignments: state.CPAssignment.cpassignments
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getCPAssignments: () => dispatch(actions.getCPAssignments()),
        deleteCPAssignment: (assignment) => dispatch(actions.deleteCPAssignment(assignment))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CPAssignmentContainer)