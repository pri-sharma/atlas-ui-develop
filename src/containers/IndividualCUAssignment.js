import React, {Component, Fragment} from 'react'
import CUAssignmentForm from "../components/Forms/CUAssignmentForm";
import ContentHolder from '../components/utility/contentHolder'
import PageHeader from '../components/utility/pageHeader'
import {Table, Modal, Button, Input, Select, Option, Switch} from 'antd'
import * as actions from "../redux/cuassignment/actions.js";
import {connect} from "react-redux";

class IndividualCUAssignment extends Component {

    state = {
        clicked: false,
        kind: '',
    };

    constructor(props) {
        super(props);
        const {handleDelete, getRoles} = this.props;
        const roleOptions = this.getRoleOptions();

        // if detailed assignment not loaded before, fetch
        // if (!this.props.detailedAssignments || !this.props.detailedAssignments[this.props.assignment.customer.id]) {
        this.props.getDetailedAssignments(this.props.assignment.customer.id);
        // }


        this.columns = [
            {
                title: 'Username',
                dataIndex: 'user',
                render: (value) => (value.username)
            },
            {
                title: 'Email',
                dataIndex: 'user',
                key: 'email',
                render: (value) => (value.email)
            },
            {
                title: 'Title',
                dataIndex: 'user',
                key: 'title',
                render: (value) => (value.title)

            },
            {
                title: 'Role',
                dataIndex: 'role',
                render: (value, record) => {
                    return (<Select id='role' defaultValue={value} onChange={(input) => this.handleChange(input, record, 'role')}>
                        {roleOptions}
                    </Select>)
                }
            },
            {
                title: 'Cascade Down',
                dataIndex: 'cascade_down',
                render: (value, record) => {
                    return (<Switch id='role' defaultChecked={value} onChange={(input) => this.handleChange(input, record, 'cascade_down')}>
                    </Switch>)
                }
            },
            {
                title: 'Actions',
                render: (value, record) => {
                    return (
                        <Fragment>
                            <Button type='danger' onClick={() => this.props.handleDelete(record)}><i className={'ion-trash-b'}/></Button>
                        </Fragment>
                    )
                }
            }
        ];
    }

    handleChange = (value, record, field) => {
        const {handleUpdate} = this.props;
        record[field] = value;
        handleUpdate(record);
    };

    getRoleOptions = () => {
        let role_list = [];
        if (this.props.roles) {
            for (const [key, value] of Object.entries(this.props.roles)) {
                role_list.push(
                    <Select.Option key={key} value={key}>{value}</Select.Option>
                )
            }
        }
        return role_list;
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.props !== nextProps) {
            return true
        }
        return true
    }

    handleClick = (e) => {
        this.setState({
            clicked: true,
            kind: e.target.innerText
        })
    };

    handleClose = () =>{
        this.setState({
            clicked: false
            }
        )
    };

    render() {
        let cust_id = this.props.assignment.customer.id;
        return (
            <Modal visible={true} closable={false} width={'150vh'} footer={<Button onClick={this.props.handleClose}>Done</Button>}>
                <PageHeader>Assignments for {this.props.assignment.customer.description} -- {this.props.assignment.customer.id}</PageHeader>
                <ContentHolder>
                    {this.props.detailedAssignments && this.props.detailedAssignments[cust_id] && this.props.detailedAssignments[cust_id].length !== 0 ?
                        <Table dataSource={this.props.detailedAssignments[cust_id]} columns={this.columns} rowKey='id'/>
                        : null}
                    {this.state.clicked && this.state.kind === 'Update Assignment' ?
                        <CUAssignmentForm kind={'PATCH'} assignment={this.state.current} handleClose={this.handleClose}/> : null}
                </ContentHolder>
            </Modal>
        )
    }
}


const mapStateToProps = state => {
    return {
        detailedAssignments: state.CUAssignment.detailedAssignments,
        }
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailedAssignments: (customer_id) => dispatch(actions.getDetailedCUAssignmentsAction(customer_id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IndividualCUAssignment);