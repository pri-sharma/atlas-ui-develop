import React, {Component} from 'react';
import {Button, Modal, Transfer} from "antd";
import {connect} from 'react-redux';
import * as actions from '../../../redux/events/actions'
import CustomizedSnackbar from "../../CustomizedSnackbar";
let products = [];

class ProductsTransfer extends Component {
    constructor(props){
        super(props);

        this.props.getPlannableProducts(this.props.customer);

        this.state = {
            selected: this.props.selected,
            products: this.props.plannableProducts || []
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.plannableProducts !== nextProps.plannableProducts || this.state !== nextState){
            this.state.products = nextProps.plannableProducts;
            return true
        }
        return false
    }

    renderProducts = () => {
        if(this.props.plannableProducts && !this.props.pending){
            products = this.state.products.map(product => {
                let description = product.description_set.find(desc => desc.language === 'EN').description;
                return {key: product, description: description}
            })
        }

        return products
    };

    handleChange = (targetKeys) => {
        this.setState({
            selected: targetKeys
        })
    };

    render() {
        this.renderProducts();
        return (
            <Modal visible title={'Add Products'} bodyStyle={{height: 450}} width={900}
                   closable={false} footer={<Button
                onClick={() => this.props.handleClick(this.state.selected)}>Done</Button>}>
                <Transfer
                    dataSource={products}
                    showSearch
                    listStyle={{
                        width: 350,
                        height: 350,
                    }}
                    operations={['add', 'remove']}
                    targetKeys={this.state.selected} //check this
                    onChange={targetKeys => this.handleChange(targetKeys)}
                    render={(product) => product.description}
                />
                <CustomizedSnackbar ref={el => this.snackbar = el}/>
            </Modal>

        )
    }
}

const mapStateToProps = state => {
    return {
        plannableProducts: state.Event.plannableProducts,
        selectedCustomer: state.PlannableCustomers.selectedCustomer,
        pending: state.Event.pendingProductsGet,
        error: state.Event.getProductsError
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPlannableProducts: (customer_id) => dispatch(actions.getPlannableProducts(customer_id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTransfer)