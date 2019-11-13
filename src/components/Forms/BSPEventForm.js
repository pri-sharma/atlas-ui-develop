import React, {Component} from 'react';
import {connect} from 'react-redux';
import LayoutContentWrapper from '../utility/layoutWrapper';
import LayoutContent from '../utility/layoutContent';
import PageHeader from '../utility/pageHeader';
import ContentHolder from '../utility/contentHolder';
import Form from '../uielements/form';
import {Select, Button, DatePicker, Input, Table} from 'antd';
import {Link} from 'react-router-dom';
import PlannableCustomerSelect from './Components/PlannableCustomerSelect';
import * as actions from '../../redux/events/actions';
import ProductsTransfer from "./Components/ProductsTransfer";
import ConditionsTransfer from "./Components/ConditionsTransfer";
import EventGrid from '../EventGrid';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import CustomizedSnackbar from '../CustomizedSnackbar'

const {Option} = Select;
const FormItem = Form.Item;

let post;

class BSPEventForm extends Component {

    constructor(props){
        super(props);
        this.productColumns = [
            {
                title: 'Material Number',
                dataIndex: 'material_number'
            },
            {
                title: 'Description',
                dataIndex: 'description_set',
                render: (value) => {
                    return (value.find(x => x.language === 'EN').description)
                }
            },
            {
                title: 'Level',
                dataIndex: 'level'
            },
            {
                title: 'EAN UPC',
                dataIndex: 'ean_upc' // TODO: double check if its the ean upc for the case or for the each

            },
            {
                title: 'PPG',
                dataIndex: 'ppg'

            },
            {
                title: 'Status',
                dataIndex: 'status.description', //TODO: figure this out later
            },
        ];

        post = this.props.location.pathname.includes('new');
        if(!post){
            const {event} = this.props.location.state;
            let products = event.eventproducts_set.map(product => product.productnode);

            this.state = {
                id: event.id,
                customer: event.eventcustomers_set[0].customer,
                products: products,
                sellout_start: event.sellout_start,
                sellout_end: event.sellout_end,
                pricing_start: event.pricing_start,
                pricing_end: event.pricing_end,
                description: event.description,
                status: event.status,
                planning_basis: 'Product Hierarchy',
            }

            //TODO: put gridRef stuff here
        } else {
            this.state = {
                customer: this.props.customer ? this.props.customer : this.props.plannableCustomers.length === 1 ? this.props.plannableCustomers[0] : '',
                products: [],
                pricing_start: new Date(),
                pricing_end: new Date(),
                description: '',
                status: 'Draft',
                planning_basis: 'Product Hierarchy',
                addProducts: false,
                conditions: [],
                addConditions: false
            };
        }

    }

    handleSubmit = () => {
        if(this.state.customer === ''){
            this.snackbar.error('Please select a Customer');
        }else if(this.state.pricing_start >= this.state.pricing_end){
            this.snackbar.error('Start date must be prior to the end date');
        }else{
            !post ? this.props.updateBSPEvent(this.state, this.state.id) : this.props.createBSPEvent(this.state)
        }
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.customer !== this.props.customer){
            this.setState({customer: nextProps.customer})
        }
    }

    handleChange = (option_key, state_value) => {
        this.setState({
            [state_value]: option_key
        });
        if(state_value === 'products'){
            this.handleClick('addProducts')
        } else if (state_value === 'conditions'){
            this.handleClick('addConditions')
        }
    };

    handleClick = (button='', type, targetKeys = []) => {
        this.setState({
            [button]: !this.state[button],
            [type]: targetKeys
        })
    };

    render() {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 18},
            layout: 'horizontal',
            style: {fontWeight: 'bold'}
        };
        return (
            <LayoutContentWrapper>
                <LayoutContent>
                    <PageHeader>{(!post) ? 'Edit Base Spend Plan' : 'New Base Spend Plan'}</PageHeader>
                    <ContentHolder>
                        <Form {...formItemLayout}>
                            <FormItem label={'Description'}>
                                <Input placeholder={this.state.description} size={'large'}
                                       onChange={(e) => this.handleChange(e.target.value, 'description')}/>
                            </FormItem>
                            <FormItem label={'Customer'}>
                                <FormControl required fullWidth>
                                    <PlannableCustomerSelect/>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>
                            </FormItem>
                            <FormItem label={'Plan Dates'}>
                                <FormItem label={'Start'} style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                    <DatePicker style={{width: '75%'}} disabled={this.state.customer === ''}
                                                placeholder={this.state.pricing_start}
                                                size={'large'} onChange={(e) => this.handleChange(e, 'pricing_start')}/>
                                </FormItem>
                                <FormItem label={'End'} style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                    <DatePicker style={{width: '75%'}} disabled={this.state.customer === ''}
                                                placeholder={this.state.pricing_end} size={'large'}
                                                onChange={(e) => this.handleChange(e, 'pricing_end')}/>
                                </FormItem>
                            </FormItem>
                            <FormItem label={'Status'}>
                                <Select defaultValue={this.state.status} id={'status'}
                                        disabled={post}
                                        onChange={(option_key) => this.handleChange(option_key, 'status')}>
                                    <Option key={'Draft'}>Draft</Option>
                                    <Option key={'Planned'}>Planned</Option>
                                    <Option key={'Customer Approved'}>Customer Approved</Option>
                                    {/*TODO: createStatusOptions*/}
                                </Select>
                            </FormItem>
                            <FormItem label={'Planning Basis'}>
                                <Select defaultValue={this.state.planning_basis} id={'planning_basis'}
                                        onChange={(option_key) => this.handleChange(option_key, 'planning_basis')}>
                                    <Option key={'Product'}>Product</Option>
                                    <Option key={'PPG'}>PPG</Option>
                                    <Option key={'Product Hierarchy'}>Product Hierarchy</Option>
                                </Select>
                            </FormItem>
                            <FormItem label={'Products'}>
                                <Table rowKey={'id'} dataSource={this.state.products} columns={this.productColumns}/>
                                <FormItem>
                                    <Button onClick={() => this.handleClick('addProducts')} disabled={this.state.customer === ''}>Add Products</Button>
                                </FormItem>
                                {this.state.addProducts && this.state.customer !== '' ?
                                    <ProductsTransfer handleClick={(targetKeys) => this.handleClick('addProducts', 'products', targetKeys)}
                                                      selected={this.state.products}
                                                      customer={this.state.customer}/> : null}

                            </FormItem>
                            <FormItem label={'Conditions'}>
                                <Table dataSource={this.state.conditions}/>
                                <FormItem>
                                    <Button onClick={() => this.handleClick('addConditions')}>Add Conditions</Button>
                                </FormItem>
                                {this.state.addConditions ?
                                    <ConditionsTransfer selected={this.state.conditions}
                                                        eventType={'BSP'}
                                                        handleClick={(targetKeys) => this.handleClick('addConditions', 'conditions', targetKeys)}
                                                        /> : null}

                            </FormItem>
                        </Form>
                        <Button type='primary' onClick={this.handleSubmit} style={{float: "right", margin: '1vh'}}>{(!post) ? 'Update' : 'Create'}</Button>
                    </ContentHolder>
                </LayoutContent>
                <CustomizedSnackbar ref = {el => this.snackbar = el}/>
                <LayoutContent>
                    <ContentHolder>
                        {post ? null : this.props.currentEvent.eventproducts_set.length !== 0 ? <EventGrid event={this.props.currentEvent} planning_basis={this.state.planning_basis}/> : null}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentEvent: state.Event.currentEvent,
        plannableCustomers: state.PlannableCustomers.plannableCustomers,
        customer: state.PlannableCustomers.selectedCustomer,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        createBSPEvent: (event) => dispatch(actions.createBSPEvent(event)),
        updateBSPEvent: (event, event_id) => dispatch(actions.updateBSPEvent(event, event_id)),
        getCurrentEvent: (event) => dispatch(actions.getCurrentEvent(event)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BSPEventForm)