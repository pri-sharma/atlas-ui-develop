import React, {Component, useRef} from 'react';
import {connect} from 'react-redux';
import LayoutContent from "../utility/layoutContent";
import PageHeader from "../utility/pageHeader";
import ContentHolder from "../utility/contentHolder";
import Form from '../uielements/form';
import {Button, DatePicker, Table, Checkbox, Pagination} from "antd";
import {Select as SelectANTD} from 'antd';
import {Input as InputANTD} from 'antd';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import LayoutContentWrapper from "../utility/layoutWrapper";
import * as actions from "../../redux/events/actions";
import * as plannableCustomerActions from "../../redux/plannableCustomers/actions";
import PlannableCustomerSelect from './Components/PlannableCustomerSelect'
import ConditionsTransfer from "./Components/ConditionsTransfer";
import ProductsTransfer from "./Components/ProductsTransfer";
import EventGrid from "../EventGrid";
import moment from 'moment';
import {CircularProgress} from "@material-ui/core";

const {Option} = SelectANTD;
const FormItem = Form.Item;
let post;

class PromoEventForm extends Component {

    constructor(props) {
        super(props);
        post = this.props.location.pathname.includes('new');
        //If you go to an event directly from the url, this will grab the id out of the url and make a call to the api.
        // We are going to need to do this probably everywhere or something like it
        if(!post){
            this.props.getCurrentEvent(this.props.match.params.id)
        }

        this.props.resetCreateTPSuccess();
        this.props.getTactics();

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
                dataIndex: 'status.description',
            },
        ];

        this.conditionColumns = [
            {
                title: 'Code',
                dataIndex: 'code'
            },
            {
                title: 'Description',
                dataIndex: 'description'
            },
            {
                title: 'Type',
                dataIndex: 'type'
            },
            {
                title: 'Sales Org',
                dataIndex: 'sales_org.sales_org'
            }
        ];

        if (!post && !this.props.eventPending && this.props.currentEvent) {
            const event = this.props.currentEvent;

            let products = event.eventproducts_set.map(product => product.productnode);
            let conditions = event.eventcondition_set.map(condition => condition.condition);
            let tactics = event.eventtactics_set.map(tactic => tactic.tactic);

            this.state = {
                id: event.id,
                customer: event.eventcustomers_set[0].customer,
                products: products,
                sellout_start: moment(event.sellout_start),
                sellout_end: moment(event.sellout_end),
                pricing_start: moment(event.pricing_start), //Will change to sell-in in sprint 1.2
                pricing_end: moment(event.pricing_end),
                ship_start: moment(event.ship_start),
                ship_end: moment(event.ship_end),
                tactics: tactics,
                description: event.description,
                status: event.status,
                conditions: conditions,
                planning_basis: 'Product',
                mandatory: ' *'
            };

            if (this.gridRef.current) {
                this.scrollToGrid()
            }
        } else if(post){
            this.state = {
                customer: this.props.customer ? this.props.customer : this.props.plannableCustomers.length === 1 ? this.props.plannableCustomers[0] : '',
                products: [],
                sellout_start: moment(),
                sellout_end: moment(),
                pricing_start: moment(),
                pricing_end: moment(),
                ship_start: moment(),
                ship_end: moment(),
                tactics: [],
                description: '',
                status: 'Draft',
                planning_basis: 'Product',
                addProducts: false,
                conditions: [],
                addConditions: false,
                mandatory: ' *',
            };
        }

        this.props.resetCreateTPSuccess();
    }

    gridRef = React.createRef();

    scrollToGrid = () => {
        this.gridRef.current.scrollIntoView({behavior: 'smooth'})
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.gridRef.current !== null && this.props.currentEvent && this.props !== nextProps && this.props.currentEvent.id === this.state.id) {
            this.scrollToGrid()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentEvent !== this.props.currentEvent && nextProps.currentEvent !== null){
            const event = nextProps.currentEvent;

            let products = event.eventproducts_set.map(product => product.productnode);
            let conditions = event.eventcondition_set.map(condition => condition.condition);
            let tactics = event.eventtactics_set.map(tactic => tactic.tactic);

            this.setState({
                id: event.id,
                customer: event.eventcustomers_set[0].customer,
                products: products,
                sellout_start: moment(event.sellout_start),
                sellout_end: moment(event.sellout_end),
                pricing_start: moment(event.pricing_start), //Will change to sell-in in sprint 1.2
                pricing_end: moment(event.pricing_end),
                ship_start: moment(event.ship_start),
                ship_end: moment(event.ship_end),
                tactics: tactics,
                description: event.description,
                status: event.status,
                conditions: conditions,
                planning_basis: 'Product',
                mandatory: ' *'
            });

            if (this.gridRef.current) {
                this.scrollToGrid()
            }
        }
        if (nextProps.createSuccess && nextProps.currentEvent) {
            this.props.history.push({
                pathname: `/promoevent/details/${nextProps.currentEvent.id}`,
                state: {event: nextProps.currentEvent, kind: 'PATCH'}
            })
        } else if (nextProps.customer != this.props.customer) {
            this.setState({customer: nextProps.customer})
        }
    }

    handleChange = (value, state_value) => {
        if (state_value === 'pricing_start') {
            this.setState({
                pricing_start: value,
                sellout_start: moment(value),
                ship_start: moment(value)
            });

        } else if (state_value === 'pricing_end') {
            this.setState({
                pricing_end: value,
                sellout_end: moment(value),
                ship_end: moment(value)
            });
        } else {
            if (this.props.customer !== '') { // TODO: look for a better place to put this if statement
                this.setState({
                    mandatory: ''
                })
            }
            this.setState({
                [state_value]: value
            })
        }
    };

    handleClick = (button = '', type, targetKeys = []) => {
        this.setState({
            [button]: !this.state[button],
            [type]: targetKeys  //type is either products or conditions
        });
    };

    handleSubmit = () => {
        post ? this.props.createTPEvent(this.state) : this.props.updateTPEvent(this.state);
    };

    render() {  // TODO: Confirm there's nothing missing in the customer select component (<PlannableCustomerSelect/>)
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 16},
            layout: 'horizontal',
            style: {fontWeight: 'bold'}
        };
        if (this.props.getEventPending) {
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress/>
                </div>
            );
        } else if(this.props.currentEvent && !this.props.eventPending || post){
            return (
                <LayoutContentWrapper>
                    <LayoutContent>
                        <PageHeader>{(!post) ? 'Edit Trade Promotion Plan' : 'New Trade Promotion Plan'}</PageHeader>
                        <ContentHolder>
                            <Form {...formItemLayout}>
                                <FormItem label={'Description'}>
                                    <InputANTD placeholder={this.state.description} size={'large'}
                                               onChange={(e) => this.handleChange(e.target.value, 'description')}/>
                                </FormItem>
                                <FormItem label={'Customer' + this.state.mandatory}>
                                    <PlannableCustomerSelect/>
                                </FormItem>
                                <FormItem label={'Pricing Dates'}>
                                    <FormItem label={'Start'}
                                              style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                        <DatePicker style={{width: '75%'}} disabled={this.props.customer === ''}
                                                    value={this.state.pricing_start}
                                                    size={'large'}
                                                    onChange={(e) => this.handleChange(e, 'pricing_start')}/>
                                    </FormItem>
                                    <FormItem label={'End'}
                                              style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                        <DatePicker style={{width: '75%'}} disabled={this.props.customer === ''}
                                                    value={this.state.pricing_end} size={'large'}
                                                    onChange={(e) => this.handleChange(e, 'pricing_end')}/>
                                    </FormItem>
                                </FormItem>
                                <FormItem label={'Plan Dates'}>
                                    <FormItem label={'Start'}
                                              style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                        <DatePicker style={{width: '75%'}} disabled={this.props.customer === ''}
                                                    value={this.state.sellout_start}
                                                    size={'large'}
                                                    onChange={(e) => this.handleChange(e, 'sellout_start')}/>
                                    </FormItem>
                                    <FormItem label={'End'}
                                              style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                        <DatePicker style={{width: '75%'}} disabled={this.props.customer === ''}
                                                    value={this.state.sellout_end} size={'large'}
                                                    onChange={(e) => this.handleChange(e, 'sellout_end')}/>
                                    </FormItem>
                                </FormItem>
                                <FormItem label={'Ship Dates'}>
                                    <FormItem label={'Start'}
                                              style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                        <DatePicker style={{width: '75%'}} disabled={this.props.customer === ''}
                                                    value={this.state.ship_start}
                                                    size={'large'}
                                                    onChange={(e) => this.handleChange(e, 'ship_start')}/>
                                    </FormItem>
                                    <FormItem label={'End'}
                                              style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                        <DatePicker style={{width: '75%'}} disabled={this.props.customer === ''}
                                                    value={this.state.ship_end} size={'large'}
                                                    onChange={(e) => this.handleChange(e, 'ship_end')}/>
                                    </FormItem>
                                </FormItem>
                                <FormItem label={'Status'}>
                                    <SelectANTD defaultValue={this.state.status} id={'status'}
                                                disabled={post}
                                                onChange={(option_key) => this.handleChange(option_key, 'status')}>
                                        <Option key={'Draft'}>Draft</Option>
                                        <Option key={'Planned'}>Planned</Option>
                                        <Option key={'Customer Approved'}>Customer Approved</Option>
                                        {/*TODO: createStatusOptions*/}
                                    </SelectANTD>
                                </FormItem>
                                <FormItem label={'Tactics'}>
                                    <FormControl variant={'outlined'} label={'Tactics'}>
                                        <Select multiple={true} value={this.state.tactics}
                                                onChange={(e) => this.handleChange(e.target.value, 'tactics')}
                                                input={<OutlinedInput name="tactics"
                                                                      id="outlined-age-simple select-multiple"/>}
                                                renderValue={selected => {
                                                    let all = []
                                                    if (selected.length === 0) {
                                                        return <em>Select Tactics</em>;
                                                    } else {
                                                        all = selected.map(tactic => tactic.name)
                                                    }
                                                    return all.join(', ');
                                                }}>
                                            {this.props.tactics.map(tactic => (
                                                <MenuItem key={tactic.id} value={tactic}>
                                                    {tactic.name}: {tactic.description}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </FormItem>
                                <FormItem label={'Planning Basis'}>
                                    <SelectANTD defaultValue={this.state.planning_basis} id={'planning_basis'}
                                                onChange={(option_key) => this.handleChange(option_key, 'planning_basis')}>
                                        <Option key={'Product'}>Product</Option>
                                        <Option key={'PPG'}>PPG</Option>
                                        <Option key={'Product Hierarchy'}>Product Hierarchy</Option>
                                    </SelectANTD>
                                </FormItem>
                                <FormItem label={'Products'}>
                                    <Table rowKey={'id'} dataSource={this.state.products}
                                           columns={this.productColumns}/>
                                    <FormItem>
                                        <Button onClick={() => this.handleClick('addProducts')}
                                                disabled={this.props.customer === ''}>Add Products</Button>
                                    </FormItem>
                                    {this.state.addProducts && this.props.customer !== '' ?
                                        <ProductsTransfer
                                            handleClick={(targetKeys) => this.handleClick('addProducts', 'products', targetKeys)}
                                            selected={this.state.products}
                                            customer={this.props.customer.id || this.props.customer}/> : null}
                                </FormItem>
                                <FormItem label={'Conditions'}>
                                    <Table rowKey={'id'} dataSource={this.state.conditions}
                                           columns={this.conditionColumns}/>
                                    <FormItem>
                                        <Button onClick={() => this.handleClick('addConditions')}>Add
                                            Conditions</Button>
                                    </FormItem>
                                    {this.state.addConditions ?
                                        <ConditionsTransfer
                                            selected={this.state.conditions}
                                            eventType={'TP'}
                                            handleClick={(targetKeys) => this.handleClick('addConditions', 'conditions', targetKeys)}/> : null}
                                </FormItem>
                            </Form>
                            <Button type={'primary'} onClick={this.handleSubmit} disabled={this.props.customer === ''}
                                    style={{float: "right", margin: '1vh'}}>{(!post) ? 'Update' : 'Create'}</Button>
                        </ContentHolder>
                    </LayoutContent>
                    <LayoutContent style={{overflow: 'auto'}}>
                        <div ref={this.gridRef}/>
                        <ContentHolder>
                            {post ? null : !this.props.currentEvent ? null : this.props.currentEvent.eventproducts_set.length > 0 ?
                                <EventGrid event={this.props.currentEvent}/> : null}
                        </ContentHolder>
                    </LayoutContent>
                </LayoutContentWrapper>
            )
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        eventPending: state.Event.getEventPending,
        currentEvent: state.Event.currentEvent,
        plannableCustomers: state.PlannableCustomers.plannableCustomers,
        customer: state.PlannableCustomers.selectedCustomer,
        createSuccess: state.Event.createTPSuccess,
        tactics: state.Event.tactics
    }
};

const mapDispatchToProps = dispatch => {
    return {
        createTPEvent: (event) => dispatch(actions.createTPEvent(event)),
        updateTPEvent: (event) => dispatch(actions.updateTPEvent(event)),
        getCurrentEvent: (event) => dispatch(actions.getCurrentEvent(event)),
        setSelectedCustomerAction: (customer) => dispatch(plannableCustomerActions.setSelectedCustomerAction(customer)),
        resetCreateTPSuccess: () => dispatch(actions.resetCreateTPSuccess()),
        getTactics: () => dispatch(actions.getTactics())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoEventForm);