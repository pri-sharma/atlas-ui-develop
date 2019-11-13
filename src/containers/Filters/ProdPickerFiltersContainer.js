// This Container is the structure for the filters bar above the grids.
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/events/actions';
import * as bvpActions from '../../redux/bvp/actions';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import Button from '@material-ui/core/Button';
import FilterComponent from './FilterComponent';
import Grid from "@material-ui/core/Grid";

class ProdPickerFiltersContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentOptions: {
                'category': [],
                'subcategory': [],
                'subbrand': [],
                'ppg': [],
                'sku': []
            },
            currentFilter: {
                'category': {},
                'subcategory': {},
                'subbrand': {},
                'ppg': {},
                'sku': {}
            },
            filteredOn: {
                'category': [],
                'subcategory': [],
                'subbrand': [],
                'ppg': [],
                'sku': []
            },
        };
        this.cleared = false;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!isEqual(this.props.filteredProducts, nextProps.filteredProducts)) {
            return true;
        } else if (!isEqual(nextState.currentOptions, this.state.currentOptions)
            || !isEqual(nextState.currentFilter, this.state.currentFilter)) {
            return true;
        }
        return false;
    }

    mapOptionsToState = () => {
        /**
         * Purpose: Convert the list of product attributes in this.props.plannableProducts to a dict of unique lists, usable for filter options
         * Return Example: {
         *     'sku': [{'id': 1, 'description': 'ABC'}, {'id': 2, 'description': 'DEF'},...]
         *     'ppg': [{'id': 50, 'description': 'UNG'}],
         *     ...
         *     }
         */
        if (this.props.filteredProducts && this.props.filteredProducts.length > 0) {
            let currentOptionsDict = {};
            let newOptions = this.props.filteredProducts;
            Object.keys(this.state.currentOptions).forEach(option => {
                let optionArray = [];
                newOptions.forEach(product => {
                    let pairedDictionary = {};
                    if(product[`${option}`]) {
                        if (option === 'ppg') {
                            pairedDictionary['id'] = product[`${option}`];
                            pairedDictionary['description'] = product[`${option}_desc`];
                        } else {
                            pairedDictionary['id'] = product[`${option}`].id;
                            pairedDictionary['description'] = product[`${option}`].description;
                        }
                    }else {
                        pairedDictionary['id'] = product[`material_number`];
                        pairedDictionary['description'] = product['description_set'].find(d => d.language === 'EN').description;
                    }
                    optionArray.push(pairedDictionary)
                });
                currentOptionsDict[option] = uniqBy(optionArray, 'id') //makes each array of dicts unique by id
            });
            this.setState({currentOptions: currentOptionsDict});
        }
    };

    handleApply = (categoryType, checked) => {
        this.cleared = false;
        let filter = [];
        let selections = {};
        let newFilter = {};
        let currentSelections = this.state.filteredOn;

        Object.keys(checked).forEach(id => filter.push(id));
        newFilter[categoryType] = checked;
        currentSelections[categoryType] = filter;

        this.setState({filteredOn: currentSelections});
        let newFilters = {...this.state.currentFilter, ...newFilter};
        this.setState({currentFilter: newFilters});

        if(currentSelections['sku'].length > 0){
            selections['sku'] = currentSelections['sku'];
            this.props.getFilteredProducts(selections)
        }else if(currentSelections['ppg'].length > 0){
            selections['ppg'] = currentSelections['ppg'];
            this.props.getFilteredProducts(selections)
        }else if(currentSelections['subbrand'].length > 0){
            selections['subbrand'] = currentSelections['subbrand'];
            this.props.getFilteredProducts(selections)
        }else if(currentSelections['subcategory'].length > 0){
            selections['subcategory'] = currentSelections['subcategory'];
            this.props.getFilteredProducts(selections)
        }else if(currentSelections['category'].length > 0){
            selections['category'] = currentSelections['category'];
            this.props.getFilteredProducts(selections)
        }else{
            this.props.getPlannableProducts(this.props.customer);
        }
    };

    handleClear = () => {
        let resetState = {
            'category': {},
            'subcategory': {},
            'subbrand': {},
            'ppg': {},
            'sku': {}
        };
        let resetOptions = {
            'category': [],
            'subcategory': [],
            'subbrand': [],
            'ppg': [],
            'sku': []
        };
        this.setState({currentFilter: resetState, filteredOn: resetOptions});
        this.props.getPlannableProducts(this.props.customer);
        this.cleared = true;
        // this.updateCurrentOptions(resetOptions);
    };

    createFilterComponents = () => {
        let components = [];

        // TODO - need to sort them to guarantee order
        Object.entries(this.state.currentOptions).map(([key, value]) => {
            components.push(
                <Grid item>
                    <FilterComponent values={value}
                                     checked={this.state.currentFilter[key]}
                                     cleared={this.cleared}
                                     key={key}
                                     categoryType={key} onApply={this.handleApply}/>
                </Grid>);
        });
        return components;
    };

    render() {
        this.mapOptionsToState();
        return (
            <Grid container direction={'row'} justify={'flex-start'} spacing={2} item style={{marginLeft:2}}>
                {this.createFilterComponents()}
                <Grid item>
                    <FilterComponent
                        values={[]}  // More Filters Select
                        checked={{}}
                        cleared={false}
                        categoryType={'more'}
                        key={'more'}
                        onApply={this.handleApply}/>
                </Grid>
                <Grid item>
                    <Button style={{
                        display: 'inline-block',
                        right: '-1%'}}
                        onClick={this.handleClear}>
                        CLEAR
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        customer: state.PlannableCustomers.selectedCustomer,
        plannableProducts: state.Event.plannableProducts,
        filteredProducts: state.Event.filteredProducts,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPlannableProducts: (customer_id) => dispatch(actions.getPlannableProducts(customer_id)),
        getFilteredProducts: (selections) => dispatch(actions.getFilteredProducts(selections)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdPickerFiltersContainer);
