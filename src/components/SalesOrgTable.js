import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table, InputNumber, Switch, Spin} from 'antd';
import {getSalesOrgs, getSalesOrgsPending, getSalesOrgsError} from '../redux/salesorg/reducer';
import * as actions from '../redux/salesorg/actions';


class SalesOrgTable extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: 'Sales Org',
                dataIndex: 'sales_org',
                editable: true,
            },
            {
                title: 'Description',
                dataIndex: 'description',
            },
            {
                title: 'Lowest Plan Level',
                dataIndex: 'lowest_plan_level',
                render: (value, record) => (
                    <InputNumber min={1} max={5} defaultValue={value} onChange={(input) => this.handleChange(input, record, 'lowest_plan_level')}/>)

            },
            {
                title: 'Enabled',
                dataIndex: 'is_enabled',
                render: (value, record) => (
                    <Switch
                        className='switch-custom'
                        defaultChecked={value}
                        disabled={value}
                        style={{borderRadius: '100px'}}
                        onChange={(input, event) => {
                            this.handleChange(input, record, 'is_enabled')
                            event.target.disabled = input; // disabled input
                        }}
                    />
                )
            }
        ];
    }


    componentWillMount() {
        const {fetchSalesOrgs} = this.props;
        fetchSalesOrgs();
    }

    handleChange = (value, record, field) => {
            const {changeSalesOrg} = this.props;
            record[field] = value;
            changeSalesOrg(record);
    };

    render() {
        const {pending, salesorgs, error} = this.props;

        if (pending) {  // loading data
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <Spin size='large'/>
                </div>
            )
        } else {
            return (<Table rowKey='id' dataSource={salesorgs} columns={this.columns} size='small'/>)
        }
    }
}

const mapStateToProps = state => ({
    error: getSalesOrgsError(state.SalesOrg),
    salesorgs: getSalesOrgs(state.SalesOrg),
    pending: getSalesOrgsPending(state.SalesOrg),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchSalesOrgs: actions.fetchSalesOrgsAction,
        changeSalesOrg: actions.changeSalesOrgAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesOrgTable);
