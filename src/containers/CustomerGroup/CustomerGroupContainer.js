import React, {Component, Fragment} from 'react';
import CustomerGroupForm from '../../components/Forms/CustomerGroupForm';
import LayoutContentWrapper from '../../components/utility/layoutWrapper'
import LayoutContent from '../../components/utility/layoutContent'
import IndividualCustomerGroup from './IndividualCustomerGroup'
import {connect} from 'react-redux';
import * as actions from '../../redux/customerGroups/actions';
import PageHeader from '../../components/utility/pageHeader'
import ContentHolder from '../../components/utility/contentHolder'
import {Button, Table} from "antd";
import {bindActionCreators} from "redux";

let descriptions;
let customer_groups;

class CustomerGroupContainer extends Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Sales Org',
                dataIndex: 'group',
                render: (value => value.sales_org.sales_org + " - " + value.sales_org.description)
            },
            {
                title: 'Group Description',
                dataIndex: 'group',
                render: (value => value.description)
            },
            {
                title: '# of Customers',
                dataIndex: 'group',
                render: (value => value.customers.length)
            },
            {
                title: '# of User-Role',
                dataIndex: 'usersRole',
                render: (value => value.length)
            }
        ];
    }

    componentDidMount() {
        this.props.getGroup();
        this.props.getGroupUserRoles();
    }

     state = {
        showGroup: false,
        current: '',
        current_ur: '',
        btnClicked: false,
        kind: '',
        descriptions: []
    };

    byGroup = () => {
        let groups = {};
        if (this.props.groups) {
            this.props.groups.forEach(group => {
                if (groups[group.id]) {
                    groups[group.id] = groups[group.id].concat(group)
                } else {
                    groups[group.id] = [group]
                }
            });
            return groups
        }
    };

    printGroups = () => {
        let groups;
        descriptions = [];
        if(this.props.groups){
            groups = this.byGroup();
            Object.values(groups).forEach(v => {
                descriptions.push(v[0])
            });
        }
        return descriptions
    };

    addGroupUserRoles = () => {
        let userRolesByGroup = [];
        let desc;
        customer_groups = [];
        desc =this.printGroups();
        desc.forEach(g => {
            this.props.groupUserRoles.forEach(groupUserRole => {
                if(g.id === groupUserRole.cg_id){
                    userRolesByGroup.push(groupUserRole)
                }
            });
            customer_groups.push({group: g, usersRole: userRolesByGroup});
            userRolesByGroup = [];
        });
        return customer_groups
    };

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText === "Add New Group" ? 'POST' : 'PATCH'
        })
    };

    handleClick = (group='') => {
        this.setState({
            showGroup: !this.state.showGroup,
            current: group.group,
            current_ur: group.usersRole
        })
    };


    handleExtra = () => {
        this.setState({
            showGroup: false,
            current: '',
            btnClicked: false
        });
    };

    handleClose = () => {
        this.setState({
            btnClicked: false
        })
    };

    render(){
        this.addGroupUserRoles();
        return(
            <LayoutContentWrapper>
                <LayoutContent>
                    <PageHeader>Customer Groups</PageHeader>
                    <ContentHolder>
                        {customer_groups.length>0 ? <Table onRow={(record, rowIndex) => {
                            return {
                                onClick: () => this.handleClick(record, rowIndex)
                            };
                        }} dataSource={customer_groups} columns={this.columns} rowKey={'group'}/> : 'No groups'}
                        {this.state.showGroup ? <IndividualCustomerGroup group={this.state.current} usersRole={this.state.current_ur} handleExtra={this.handleExtra} handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked && this.state.kind === 'POST' ? <CustomerGroupForm kind={'POST'} handleClose={this.handleClose}/> : null}
                        <br/>
                        <Button onClick={this.handleBtnClick}>Add New Group</Button>
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        groups: state.CustomerGroup.groups,
        groupUserRoles: state.CustomerGroup.groupUserRoles,
        users: state.CustomerGroup.users,
        customers: state.CustomerGroup.customers,
        addedGroup: state.CustomerGroup.customers,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getGroup: actions.getGroupAction,
        getGroupUserRoles: actions.getUserRolesAction,
        addGroup: actions.addGroupAction,
        addUserRole: actions.addUserRoleAction,
        deleteGroup: actions.deleteGroupAction,
        updateGroup: actions.updateGroupAction,
        getUsers: actions.getUsersAction,
        getCustomersBySalesOrg: actions.getCustomersBySalesOrgAction,
        getSalesOrg: actions.getSalesOrgActions
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerGroupContainer)