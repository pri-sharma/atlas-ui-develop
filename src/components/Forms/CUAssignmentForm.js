import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/cuassignment/actions';
import Form from '../../components/uielements/form';
import {bindActionCreators} from 'redux';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutWrapper from '../../components/utility/layoutWrapper.js';
import LayoutContent from '../../components/utility/layoutContent';
import Input from '../../components/uielements/input';
import {Modal, Select, DatePicker, Switch} from 'antd'

const {Option} = Select;

const FormItem = Form.Item;

let customer_list;
let user_list;
let role_list;
let levels = [];

//add descriptions for products
//multi select for product and customer
class CUAssignmentForm extends Component {

    state = {
        role: 'Select a role',
        customer: 'Select a Customer',
        user: 'Select a User',
        cascade_down: false,
    };

    componentDidMount() {
        if (this.props.kind === 'PATCH') {
            this.setState({
                customer: this.props.assignment.customer.id,
                role: this.props.assignment.role,
                cascade_down: this.props.assignment.cascade_down,
                user: this.props.assignment.user.id
            })
        }
    }

    componentWillMount() {
        this.createLevelOptions();
        this.props.getUsers();
        this.props.getRoles();
    }

    handleLevelChange = (e) => {
        this.setState({
            level: e
        }, () => this.props.getCustomersByLevel(this.state.level))
    };

    handleChange = (e, type = '') => {
        this.setState({
            [type]: e
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (!(this.state.customer === '' || this.state.user === '')) {
            if (this.props.kind === 'POST') {
                this.props.addAssignment(this.state)
            } else {
                this.props.updateAssignment(this.props.assignment.id, this.state)
            }
        }
        this.props.handleClose()
    };

    createLevelOptions = () => {
        levels = [];
        for (let i = 0; i < 9; i++) {
            levels.push(<Option key={i}>{i}</Option>)
        }
    };

    createCustomerOptions = () => {
        if (this.props.customers) {
            customer_list = this.props.customers.map(cust => {
                return (
                    <Option key={cust.id} value={cust.id}>{cust.description} -- {cust.customer_id}</Option>
                )
            });
        }
    };
    createUserOptions = () => {
        if (this.props.users) {
            user_list = this.props.users.map(usr => {
                return (
                    <Option key={usr.id} value={usr.id}>{usr.username}</Option>
                )
            })
        }
    };

    createRoleOptions = () => {
        if (this.props.roles) {
            role_list = [];
            for (const [key, value] of Object.entries(this.props.roles)) {
                role_list.push(
                    <Option key={key} value={key}>{value}</Option>
                )
            }
        }
    };

    render() {
        this.createCustomerOptions();
        this.createRoleOptions();
        this.createUserOptions();
        return (
            <Modal visible={true}
                   okText={this.props.kind === 'POST' ? 'Create Assignment' : 'Update Assignment'}
                   onOk={this.handleSubmit}
                   title='Create A New Customer User Assignment'
                   onCancel={this.props.handleClose}
            >
                <Form>
                    <FormItem label='Level'>
                        <Select defaultValue={this.state.level} id='level' onChange={this.handleLevelChange}>
                            {levels}
                        </Select>
                    </FormItem>
                    <FormItem label='Customer'>
                        <Select defaultValue={this.state.customer} onChange={(e) => this.handleChange(e, 'customer')}>
                            {customer_list ? customer_list : null}
                        </Select>
                    </FormItem>
                    <FormItem label='User'>
                        <Select defaultValue={this.state.user} onChange={(e) => this.handleChange(e, 'user')} id='user'>
                            {user_list ? user_list : null}
                        </Select>
                    </FormItem>
                    <FormItem label='Role'>
                        <Select defaultValue={this.state.role} onChange={(e) => this.handleChange(e, 'role')} id='role'>
                            {role_list ? role_list : null}
                        </Select>
                    </FormItem>
                    <FormItem label='Cascade Down'>
                        <Switch defaultValue={false} onChange={(e) => this.handleChange(e, 'cascade_down')} id='cascade_down'>
                        </Switch>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        customers: state.CUAssignment.customers,
        users: state.CUAssignment.users,
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
        getCustomersByLevel: actions.getCustomersByLevelAction,
        getRoles: actions.getRolesActions
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CUAssignmentForm)