import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/customerGroups/actions';
import Form from '../../components/uielements/form';
import {Modal, Select, Input} from 'antd';
import {bindActionCreators} from "redux";

const FormItem = Form.Item;

let customer_list;
let salesorg_list;
let user_list;
let role_list;

class CustomerGroupForm extends Component {

    state = {
        salesorg: 'Select a Sales Organization',
        customers: [],
        user: 'Select a User',
        role: 'Select a User Role',
        description: '',
        addedGroup: ''
    };

    componentDidMount(){
         if(this.props.kind === 'PATCH'){
            this.setState({
                customers: this.props.group.customer.id,
                salesorg: this.props.group.salesorg.id,
                users: this.props.group.user.id,
                description: this.props.group.description
            })
        }
         this.props.getUsers();
         this.props.getSalesOrg();
    }

    handleSalesOrgChange = (e) => {
        this.setState({
            salesorg: e
        }, () => this.props.getCustomersBySalesOrg(this.state.salesorg))
    };

    handleChange = (e, type = '') => {
        this.setState({
            [type]: e
        })
    };
    handleInputChange(e, type = ''){
        this.setState({
            [type]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (!(this.state.customers === '' || this.state.user === '')) {
            if (this.props.kind === 'POST') {
                this.props.addGroup(this.state);
            } else {
                this.props.updateGroup(this.props.group.id, this.state);
            }
        }
        this.props.handleClose()
    };

    createSalesOrgOptions = () => {
        if (this.props.salesorg) {
            salesorg_list = this.props.salesorg.map(sorg => {
                return (
                    <option key={sorg.id} value={sorg.id}>{sorg.description}</option>
                )
            });
        }
    };

    createCustomerOptions = () => {
        if (this.props.customers) {
            customer_list = this.props.customers.map(cust => {
                return (
                    <option key={cust.id} value={cust.id}>{cust.description} -- {cust.customer_id}</option>
                )
            });
        }
    };
    createUserOptions = () => {
        if (this.props.users) {
            user_list = this.props.users.map(usr => {
                return (
                    <option key={usr.id} value={usr.id}>{usr.username}</option>
                )
            })
        }
    };
    createRoleOptions = () => {
        let roles = [{id:'KAM', name: 'Key Account Manager'},
                     {id: 'FINANCE_APPROVER', name: 'Finance Approver'},
                     {id:'GIT_USER', name: 'GIT User'},
                     {id:'GIT_ADMIN', name: 'GIT Administrator'},
                     {id: 'READ_ONLY', name: 'Read Only'},
                     {id: 'TEAM_LEAD', name: 'Team Lead'} ];
        role_list = roles.map(role => {
                return (
                    <option key={role.id} value={role.id}>{role.name}</option>
                )
            })
    };

    render() { // TODO: Enable user and role to create group and handling sync call to create userRole relationship on back end after group creation
        this.createCustomerOptions();
        this.createUserOptions();
        this.createSalesOrgOptions();
        this.createRoleOptions();

        return (
            <Modal visible={true}
                   okText={this.props.kind === 'POST' ? 'Create Group' : 'Update Group'}
                   onOk={this.handleSubmit}
                   title='Create a New Customer Group'
                   onCancel={this.props.handleClose}>
                <Form>
                    <FormItem label='Sales Org'>
                        <Select defaultValue={this.state.salesorg} id='salesorg' onChange={(e) => this.handleSalesOrgChange(e)}>
                            {salesorg_list}
                        </Select>
                    </FormItem>
                    <FormItem label='Customer'>
                        <Select mode={"multiple"} defaultValue={this.state.customers} onChange={(e) => this.handleChange(e, 'customers')}>
                            {customer_list ? customer_list : null}
                        </Select>
                    </FormItem>
                    {/*<FormItem label='User'>*/}
                    {/*    <Select defaultValue={this.state.user} onChange={(e) => this.handleChange(e, 'user')}>*/}
                    {/*        {user_list ? user_list : null}*/}
                    {/*    </Select>*/}
                    {/*</FormItem>*/}
                    {/*<FormItem label='Role'>*/}
                    {/*    <Select defaultValue={this.state.role} onChange={(e) => this.handleChange(e, 'role')}>*/}
                    {/*        {role_list ? role_list : null}*/}
                    {/*    </Select>*/}
                    {/*</FormItem>*/}
                    <FormItem label='Description'>
                        <Input defaultValue={this.state.description} placeholder={'Description'} onChange={(e) => this.handleInputChange(e, 'description')} id='description'>
                        </Input>
                    </FormItem>
                </Form>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
        customers: state.CustomerGroup.customers,
        users: state.CustomerGroup.users,
        salesorg: state.CustomerGroup.salesorg,
        groups: state.CustomerGroup.groups,
        addedGroup: state.CustomerGroup.addedGroup
    }
};

const mapDispatchToProps = dispatch => {
        return bindActionCreators({
        getGroup: actions.getGroupAction,
        addGroup: actions.addGroupAction,
        addUserRole: actions.addUserRoleAction,
        deleteGroup: actions.deleteGroupAction,
        updateGroup: actions.updateGroupAction,
        getUsers: actions.getUsersAction,
        getCustomersBySalesOrg: actions.getCustomersBySalesOrgAction,
        getSalesOrg: actions.getSalesOrgActions
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerGroupForm)