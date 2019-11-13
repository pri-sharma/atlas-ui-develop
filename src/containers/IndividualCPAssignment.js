import React, {Component, Fragment} from 'react'
import CPAssignmentForm from "../components/Forms/CPAssignmentForm";
import ContentHolder from '../components/utility/contentHolder'
import PageHeader from '../components/utility/pageHeader'
import {Table, Modal, Button, Input} from 'antd'
import * as actions from "../redux/app/actions/cpassignments";
import {connect} from "react-redux";


class IndividualCPAssignment extends Component {
    constructor(props) {
        super(props);


        this.props.getDetailedAssignments(this.props.assignment.customer.id);


        this.state = {
            clicked: false,
            kind: ''
        };

        this.columns = [{
            title: 'Material Number',
            dataIndex: 'product',
            key: 'material',
            render: (value) => (Number(value.material_number))
        },
            {
                title: 'Description',
                dataIndex: 'product',
                key: 'description',
                render: (value) => (
                    value.description_set.find(x => x.language === 'EN').description)
            },
            {
                title: 'Sales Org',
                dataIndex: 'product',
                key: 'sales_org',
                render: (value) => (value.sales_org.sales_org)

            },
            {
                title: 'Level',
                dataIndex: 'product',
                key: 'level',
                render: (value) => (value.level)
            },
            {
                title: 'EAN UPC',
                dataIndex: 'product',
                key: 'upc',
                render: (value) => (value.ean_upc)

            },
            {
                title: 'PPG',
                dataIndex: 'product',
                key: 'ppg',
                render: (value) => (value.ppg)

            },
            {
                title: 'Status',
                dataIndex: 'product',
                key: 'status',
                render: (value) => (value.status.description)
            },
            {
                title: 'Valid From',
                dataIndex: 'valid_from'
            },
            {
                title: 'Valid To',
                dataIndex: 'valid_to'
            },
            {
                title: 'Actions',
                render: (value, record) => {
                    return (
                        <Fragment>
                            <Button type='danger' onClick={() => this.props.handleDelete(record)}><i className={'ion-trash-b'}/></Button>
                            <Button type='primary' onClick={() => this.handleClick(record)}><i className={'ion-edit'}/></Button>
                        </Fragment>
                    )
                }
            }
        ];
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.props !== nextProps) {
            return true
        }
        return true
    }

    handleClick = (record) => {
        this.setState({
            clicked: true,
            kind: 'Update Assignment',
            current: record
        })
    };

    handleClose = () => {
        this.setState({
            clicked: false,
        })
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
                        <CPAssignmentForm kind={'PATCH'} assignment={this.state.current} handleClose={this.handleClose}/> : null}
                </ContentHolder>
            </Modal>
        )
    }
}


const mapStateToProps = state => {
    return {
        detailedAssignments: state.CPAssignment.detailedAssignments
    }
};

const mapDispatchToProps = dispatch => {
    return {
        //deleteCPAssignment: (assignment) => dispatch(actions.deleteCPAssignment(assignment)),
        getDetailedAssignments: (customer_id) => dispatch(actions.getDetailedCPAssignments(customer_id)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IndividualCPAssignment);
