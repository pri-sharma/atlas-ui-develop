import React, {Component, Fragment} from 'react'
import ContentHolder from '../../components/utility/contentHolder'
import PageHeader from '../../components/utility/pageHeader'
import {Table, Button, Select} from 'antd'
import * as actions from '../../redux/customerGroups/actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import LayoutContent from '../../components/utility/layoutContent'

let customer_list;
let user_list;
let role_list;
let customers_state;
let users_state;

class IndividualCustomerGroup extends Component {

    state = {
    clicked: false,
    showUpdate: false,
    kind: '',
    user: 'Select a User',
    role: 'Select a User Role',
    customer: 'Select a Customer',
    sales_org: this.props.group.sales_org.id,
    group: '',
    users:[],
    customers:[],
    description:''
    };

    constructor(props) {
        super(props);

        this.UserCol = [
            {
                title: 'Username',
                dataIndex: 'user',
                width: 500,
                render: (value) => (value.username)
            },
            {
                title: 'Full Name',
                dataIndex: 'user',
                width: 500,
                render: (value) => (value.full_name)
            },
            {
                title: 'Role',
                dataIndex: 'role',
                width: 500,
                render: (value) => (value)
            },
            {
                title: 'Actions',
                fixed: 'right',
                width: 100,
                render: (value, record) => {
                    return (
                        <Fragment>
                            <Button type='danger' onClick={() => this.handleDeleteUser(record)}><i className={'ion-trash-b'}/></Button>
                        </Fragment>
                    )
                }
            }];
        this.CustomerCol =[
            {
                title: 'Customer',
                dataIndex: 'description',
                render: (value) => (value)
            },
            {
                title: 'Id',
                dataIndex: 'customer_id',
                render: (value) => (value)
            },
            {
                title: 'Level',
                dataIndex: 'level',
                render: (value) => (value)
            },
            {
                title: 'Actions',
                fixed: 'right',
                width: 100,
                render: (value, record) => {
                    return (
                        <Fragment>
                            <Button type='danger' onClick={() => this.handleDeleteCustomer(record)}><i className={'ion-trash-b'}/></Button>
                        </Fragment>
                    )
                }
            }
        ];
    }

    componentDidMount(){
        this.setState({
            customers: customers_state,
            users: users_state,
            description: this.props.group.description

        });

        this.props.getUsers();
        this.props.getCustomersBySalesOrg(this.state.sales_org);

    };

    handleChange = (value, record, field) => {
        const {handleUpdate} = this.props;
            record[field] = value;
            handleUpdate(record);
    };

    handleSelectChange = (e, type = '') => {
        this.setState({
            [type]: e
        })
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

    handleUpdateBtn = (e) => {
        this.setState({
            showUpdate: !this.state.showUpdate
        })
    };

    handleAddUser = (e) => {
        e.preventDefault();
        this.setState({
            showUpdate: false
        });
        this.props.addUsers(this.state, this.props.group.id);
        this.props.getGroup();
    };
    handleAddCustomer = (e) => {
        e.preventDefault();
        const{handleExtra} = this.props;
        this.setState({
            showUpdate: false
        });
        this.props.updateCustomers(this.state.customer, this.props.group.id);
        this.props.getGroup();
        handleExtra();
    };

    handleDelete = () => {
        const{handleExtra} = this.props;
        this.props.deleteGroup(this.props.group);

        this.setState({
            showGroup: false,
            current: '',
            btnClicked: false
        });
        handleExtra();
    };

    handleDeleteUser = (record) => {
        const{handleExtra} = this.props;
        this.setState({
            showUpdate: false
        });
        this.props.deleteUser(record.id);
        this.props.getGroupUserRoles();
        handleExtra();
    };

    handleDeleteCustomer = (record) => {
        const{handleExtra} = this.props;
        this.setState({
            showUpdate: false
        });
        this.props.deleteCustomer(record.id, this.props.group.id);
        this.props.getGroup();
        handleExtra();
    };


    createUserOptions = () => {
        if(this.props.users){
            user_list = this.props.users.map(usr => {
                return(
                    <option key={usr.id} value={usr.id}>{usr.username}</option>
                )
            })
        }
    };

    createCustomerOptions = () => {
        if (this.props.customers) {
            customer_list = this.props.customers.map(cust => {
                return (
                    <option key={cust.id} value={cust.id}>{cust.description} -- {cust.customer_id}</option>
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

    render() {
        this.createUserOptions();
        this.createCustomerOptions();
        this.createRoleOptions();
        return (
            <LayoutContent>
                <PageHeader>Customers and Users for {this.props.group.description}</PageHeader>
                <ContentHolder>
                    <div style={{textAlign:'center'}}>
                        <Table dataSource={this.props.usersRole} columns={this.UserCol} rowKey={'username'} scroll={{ y: 240 }}/>
                        <Table dataSource={this.props.group.customers} columns={this.CustomerCol} rowKey={'id'}/>
                        <div>
                            <Button  onClick={this.handleUpdateBtn}>Update Group</Button>&nbsp;&nbsp;&nbsp;
                            <Button  onClick={this.handleDelete} type={"danger"}>Delete Group</Button>
                        </div>
                        {this.state.showUpdate ?
                            <ContentHolder>
                                 <div>
                                    <PageHeader><small>Add User or Customer</small></PageHeader>
                                    <Select style={{width: 300}} defaultValue={this.state.user} onChange={(e) => this.handleSelectChange(e, 'user')} id='user'>
                                        {user_list ? user_list : null}
                                    </Select>&nbsp;&nbsp;&nbsp;
                                    <Select style={{width: 300}} defaultValue={this.state.role} onChange={(e) => this.handleSelectChange(e, 'role')} id='role'>
                                        {role_list ? role_list : null}
                                    </Select>&nbsp;&nbsp;&nbsp;
                                    <Button onClick={this.handleAddUser} style={{width: 120}}>Add User</Button>
                                         <br/>
                                         <br/>
                                     <Select style={{width: 300}} defaultValue={this.state.customer} onChange={(e) => this.handleSelectChange(e, 'customer')} id='customer'>
                                        {customer_list ? customer_list : null}
                                    </Select>&nbsp;&nbsp;&nbsp;
                                     <Button onClick={this.handleAddCustomer} style={{width: 120}}>Add Customer</Button>
                                </div>
                            </ContentHolder>: null}
                    </div>
                </ContentHolder>

            </LayoutContent>
        )

    }

}
const mapStateToProps = state => {
    return {
        customers: state.CustomerGroup.customers,
        users: state.CustomerGroup.users,
        salesorg: state.CustomerGroup.salesorg,
        groups: state.CustomerGroup.groups,
        groupUserRoles: state.CustomerGroup.groupUserRoles
    }
};

const mapDispatchToProps = dispatch => {
        return bindActionCreators({
        getGroup: actions.getGroupAction,
        addGroup: actions.addGroupAction,
        deleteGroup: actions.deleteGroupAction,
        deleteUser: actions.deleteUserAction,
        deleteCustomer: actions.deleteCustomerAction,
        updateGroup: actions.updateGroupAction,
        addUsers: actions.addUserRoleAction,
        updateCustomers: actions.updateCustomersAction,
        getUsers: actions.getUsersAction,
        getGroupUserRoles: actions.getUserRolesAction,
        getCustomersBySalesOrg: actions.getCustomersBySalesOrgAction,
        getSalesOrg: actions.getSalesOrgActions
    }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(IndividualCustomerGroup)