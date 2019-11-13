import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/app/actions/cpassignments';
import Form from '../../components/uielements/form';
import {Modal, Select, DatePicker} from 'antd';

const {Option} = Select;
const FormItem = Form.Item;

let TEMP_SALES_ORG_ID = 67; // TODO: Make this dynamic!

let customer_list;
let product_list;
let levels = [];

//add descriptions for products
//multi select for product and customer
class CPAssignmentForm extends Component {

    state = {
        level: 'Select a Level',
        customer: 'Select a Customer',
        product: 'Select a Product',
        valid_to: new Date(),
        valid_from: new Date()
    };

    componentDidMount(){
         if(this.props.kind === 'PATCH'){
            this.setState({
                customer: this.props.assignment.customer.id,
                product: this.props.assignment.product.id,
                valid_to: new Date(this.props.assignment.valid_to),
                valid_from: new Date(this.props.assignment.valid_from)
            })
        }
    }

    componentWillMount() {
        this.createLevelOptions();
        this.props.getProductsBySalesOrg(TEMP_SALES_ORG_ID);
    }

    handleLevelChange = (e) => {
        this.setState({
            level: e
        }, () => this.props.getCustomersByLevel(this.state.level))
    };

    handleChange = (e, type='') => {
        this.setState({
            [type]: e
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if(!(this.state.customer === '' || this.state.product === '')){
            if(this.props.kind === 'POST'){
                this.props.createCPAssignment(this.state)
            } else {
                this.props.updateCPAssignment(this.props.assignment.id, this.state)
            }
        }

        this.props.handleClose()

    };

    createLevelOptions = () => {
        levels = [];
        for(let i=0; i<9; i++){
            levels.push(<Option key={i}>{i}</Option>)
        }
    };

    createCustomerOptions = () => {
        if(this.props.customers) {
            customer_list = this.props.customers.map(cust => {
            return(
                <Option key={cust.id} value={cust.id}>{cust.description} -- {cust.customer_id}</Option>
                )
            });
        }
    };

    createProductOptions = () => {
         if(this.props.products){
            product_list = this.props.products.map(prod => {
                let material = Number(prod.material_number);
                let desc_obj = (prod.description_set) ? prod.description_set.find(x => x.language === 'EN') : null; // TODO: make the language dynamic later?
                let desc_txt = (desc_obj) ? desc_obj.description : '';
                return(
                    <Option key={prod.material_number} value={prod.id}>{desc_txt} -- {material}</Option>
                    )
                })
        }
    };

    render() {
        this.createCustomerOptions();
        this.createProductOptions();

        return (

            <Modal visible={true}
                   okText={this.props.kind === 'POST' ? 'Create Assignment' : 'Update Assignment'}
                   onOk={this.handleSubmit}
                   title={this.props.kind === 'POST' ? 'Create A New Customer Product Assignment' : 'Update Customer Product Assignment'}
                   onCancel={this.props.handleClose}
            >
                <Form>
                    <FormItem>
                        <Select defaultValue={this.state.level} id='level' onChange={this.handleLevelChange}>
                            {levels}
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select defaultValue={this.state.customer} onChange={(e) => this.handleChange(e, 'customer')}>
                            {customer_list ? customer_list : null}
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select defaultValue={this.state.product} onChange={(e) => this.handleChange(e, 'product')} id='product'>
                            {product_list ? product_list : null}
                        </Select>
                    </FormItem>
                    <FormItem>
                        <label>Valid From</label>
                        <DatePicker placeholder={this.state.valid_from} onChange={(e) => this.handleChange(e._d, 'valid_from')}/>
                    </FormItem>
                    <FormItem>
                        <label>Valid To</label>
                        <DatePicker placeholder={this.state.valid_to} onChange={(e) => this.handleChange(e._d, 'valid_to')}/>
                    </FormItem>
                </Form>
            </Modal>

        )
    }
}

const mapStateToProps = state => {
    return {
        customers: state.CPAssignment.customersByLevel,
        products: state.CPAssignment.productsBySalesOrg
    }
};

const mapDispatchToProps = dispatch => {
    return{
        getCustomersByLevel: (level) => dispatch(actions.loadCustomersByLevel(level)),
        getProductsBySalesOrg: (sales_org) => dispatch(actions.loadProductsBySalesOrg(sales_org)),
        createCPAssignment: (assignment) => dispatch(actions.postCPAssignment(assignment)),
        updateCPAssignment: (assignment_id, update) => dispatch(actions.patchCPAssignment(assignment_id, update))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CPAssignmentForm)