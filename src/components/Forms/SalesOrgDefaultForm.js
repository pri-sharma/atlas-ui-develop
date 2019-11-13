import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/salesorgDefaults/actions';
import * as salesorg_actions from '../../redux/customerGroups/actions';
import * as attribute_actions from '../../redux/attributes/actions';
import {Modal, Select, Input, Form, Icon} from 'antd';
import moment from "moment";
import AttributesForm from './AttributesForm'

const FormItem = Form.Item;

let salesorg_list;
let value_list;
let attribute_list;

class SalesOrgDefaultForm extends Component {

    state = {
        sales_org: null,
        value: '',
        key:'',
        btnClicked: false,
    };

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText
        })
    };

    componentDidMount(){
        this.props.getSalesOrg();
        this.props.getAttributes();

        if(this.props.type==="PATCH") {
            if(this.props.sales_org)
            {
                this.setState({
                    sales_org: this.props.sales_org.id
                })
            }
            console.log('key', this.props.key);
            this.setState({
                key: this.props.attribute,
                value: this.props.value,
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.attribute, nextProps.value, 'props')
    }

    componentWillMount() {

    }

    handleChange = (e, type='') => {
        this.setState({
            [type]: e
        })
    };

    handleClose = () => {
        this.setState({
            btnClicked: false,
            showAssignment: this.state.showAssignment
        })
    };


    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.props.id){
            this.props.createSalesOrgDefaults(this.state)
        }
        else {
            this.props.updateSalesOrgDefaults(this.state, this.props.id)
        }

        this.props.handleClose()
    };

    handleSalesOrgChange = (e) => {
        this.setState({
            sales_org: e
        });
    };

    handleValueChange = (e) => {
        this.setState({
            value: e
        });
    };

    handleAttrubuteChange = (e) => {
        console.log('change', e);
        this.setState({key: e, value: ''});

        this.createValueOptions(e);
    };

    createSalesOrgOptions = () => {
        if (this.props.salesorg) {
            salesorg_list = this.props.salesorg.map(sorg => {
                return (
                    <Select.Option key={sorg.id} value={sorg.id}>{sorg.sales_org + " - " + sorg.description}</Select.Option>
                )
            });
        }
    };

    createValueOptions = (type) => {
        let corresponding_values = this.props.attributes.findIndex(obj => obj.key === type);
        let values_obj = this.props.attributes[corresponding_values].value;
        value_list = Object.entries(values_obj).map((item, i)=>{
            return(
                <Select.Option key={i} value={item[1]}>{item[1]}</Select.Option>
            )
        })
    };

    createArrtibutesList = () => {
        attribute_list = this.props.attributes.map((item, id)=>{
            return(
                <Select.Option key={id} value={item.key}>{item.key}</Select.Option>
            );
        })
    };

    render() {

        const formItemLayout = {labelCol: {xs: { span: 12 }, sm: { span: 4 },},
                                wrapperCol: {xs: { span: 12 }, sm: { span: 14 },},};

        this.createSalesOrgOptions();
        this.createArrtibutesList();

        return (

            <Modal visible={true}
                   okText={this.props.kind === 'POST' ? 'Create' : 'Update'}
                   onOk={this.handleSubmit}
                   title={this.props.kind === 'POST' ? 'Create A New Sales Org Default' : 'Update Sales Org Default'}
                   onCancel={this.props.handleClose}
            >
                <Form {...formItemLayout}>
                    <FormItem label='Sales Org' labelAlign={'horizontal'}>
                        <Select style={{width:'85%', marginRight:8}} option defaultValue={this.state.sales_org} id='salesorg' onChange={(e) => this.handleSalesOrgChange(e)}>
                            <Select.Option disabled={true} value={''}>Select SalesOrg</Select.Option>
                            {salesorg_list}
                        </Select>
                    </FormItem>

                    <FormItem label='Attribute'>
                        <Select style={{width:'85%', marginRight:8}} option defaultValue={this.state.key} id='key' onChange={(e) => this.handleAttrubuteChange(e)}>
                            <Select.Option disabled={true} value={''}>Select an Attribute</Select.Option>
                            {attribute_list}
                        </Select>
                        <Icon className="dynamic-delete-button" type="plus-circle" style={{fontSize:20}} onClick={this.handleBtnClick}/>
                        {this.state.showAssignment ? <AttributesForm type={"PATCH"} id={this.state.id} title={this.state.title} body={this.state.body} sales_org={this.state.sales_org} handleUpdate={this.handleUpdate} handleDelete={this.handleDelete} handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked ? <AttributesForm kind={'POST'} handleClose={this.handleClose}/> : null}
                    </FormItem>

                    <FormItem label='Value'>
                        <Select style={{width:'85%', marginRight:8}} option defaultValue={this.state.value ? this.state.value : ''} id='weekday' onChange={(e) => this.handleValueChange(e)}>
                            <Select.Option disabled={true} value={''}>Select a Value</Select.Option>
                            {value_list}
                        </Select>
                    </FormItem>
                </Form>
            </Modal>

        )
    }
}

const mapStateToProps = state => {
    return {
        salesorg: state.CustomerGroup.salesorg,
        attributes: state.Attributes.attributes,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        createSalesOrgDefaults: (sales_org_default) => dispatch(actions.addSalesOrgDefaultAction(sales_org_default)),
        updateSalesOrgDefaults: (sales_org_default_id, sales_org_default) => dispatch(actions.updateSalesOrgDefaultAction(sales_org_default_id, sales_org_default)),
        getSalesOrg: ()=> dispatch(salesorg_actions.getSalesOrgActions()),
        getAttributes: ()=> dispatch(attribute_actions.getAttributesAction())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesOrgDefaultForm)