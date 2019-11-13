import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import FilterNoneSharpIcon from '@material-ui/icons/FilterNoneSharp';
import CustomizedDialog from '../customizedDialog/CustomizedDialog';
import BrushIcon from '../../images/Brush.png';
import ProductGrid from './ProductGrid';
import * as actions from '../../redux/events/actions';
import {connect} from 'react-redux';

class ProductPicker extends Component{

    constructor(props) {
        super(props);

        this.state = {
            isProductPickerOpen: false,
            selectedGrid: '',
            selectedProds: []
        };

        this.columnDefsPPGSKU = [
            {
                headerName: 'Category',
                field: 'category.description',
                editable: true,
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 0,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'Subcategory',
                field: 'subcategory.description',
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 1,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'PPG',
                field: 'ppg',
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 2,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'Status',
                field: 'status',
                filter: true,
                icons: {menu: '<i class="material-icons">filter_list</i>'},
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'UoM',
                field:'sales_uom',
                filter: true,
                icons: {menu: '<i class="material-icons">filter_list</i>'},
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'UPC',
                field:'ean_upc',
                filter: true,
                icons: {menu: '<i class="material-icons">filter_list</i>'},
                menuTabs: ['filterMenuTab'],
            },
            // {
            //     headerName: 'List Price',
            //     filter: true,
            //     menuTabs: ['filterMenuTab'],
            // }
        ];

        this.columnDefsPH = [
            {
                headerName: 'Category',
                field: 'category.description',
                editable: true,
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 0,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'Subcategory',
                field: 'subcategory.description',
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 1,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'Subbrand',
                field: 'subbrand.description',
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 2,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'Variant',
                field: 'variant.description',
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 3,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'PPG',
                field: 'ppg',
                filter: true,
                enableRowGroup: true,
                rowGroup: true,
                rowGroupIndex: 4,
                menuTabs: ['filterMenuTab'],
                hide: true,

            },
            {
                headerName: 'Status',
                field: 'status',
                filter: true,
                icons: {menu: '<i class="material-icons">filter_list</i>'},
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'UoM',
                field:'sales_uom',
                filter: true,
                icons: {menu: '<i class="material-icons">filter_list</i>'},
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'UPC',
                field:'ean_upc',
                filter: true,
                icons: {menu: '<i class="material-icons">filter_list</i>'},
                menuTabs: ['filterMenuTab'],
            },
            // {
            //     headerName: 'List Price',
            //     filter: true,
            //     menuTabs: ['filterMenuTab'],
            // }
        ];
    }

    onChange = (event) => {
        this.setState({selectedGrid: event.currentTarget.value});
    };

    shouldComponentUpdate(nextProps, nextState, nextContext){
        return this.props !== nextProps || this.state !== nextState;
    }

        /**
     * Customize table button handler, set state to opened and clone copy the currentCols
     * @param event
     */
    onOpen = (event) => {
        this.setState({isProductPickerOpen: true});
    };

       /**
     * Customize table button even handler, set state to closed and throw away the customizedColumns state changes
     * @param event
     */
    onCancel = (event) => {
        this.setState({
            isProductPickerOpen: false,
            selectedProds: []});
    };

     /**
     * Customize table Apply onClick handler, update currentCols, reset the productPicker state, and update grid
     */
    onApply = () => {
        this.props.onPPChange(this.state.selectedProds);
        this.setState({
            isProductPickerOpen: false,
            selectedProds: []
        });
    };

    deleteProd = (prod_id) => {
        this.props.deleteProd(prod_id);
    };

    selectedProds = (selProds) => {
        this.setState({
            selectedProds: selProds,
        });
    };

    render() {
        return (
                <Grid item>
                    <Button onClick={this.onOpen} style={{fontSize: '.8rem'}}>
                        <FilterNoneSharpIcon fontSize={'small'} style={{paddingRight: 3, color: 'black'}}/>
                        Manage Products
                    </Button>
                    <CustomizedDialog onClose={this.onCancel}
                                      open={this.state.isProductPickerOpen}
                                      img={BrushIcon}
                                      title={'Manage Products'}
                                      submitText={'APPLY'}
                                      hideSubmit={this.state.selectedGrid === ''}
                                      onSubmit={this.onApply}>
                        {this.state.selectedGrid === '' ?
                            <div style={{margin: '2rem', width: '50rem', display: "flex"}}>
                                <Typography variant={'body1'} style={{paddingTop: 10}}>
                                How would you like to select products for your promotion?
                                </Typography>
                                <RadioGroup style={{paddingLeft: 75}} onChange={this.onChange} row>
                                    <FormControlLabel control={<Radio color={"default"}/>} label={'Product Hierarchy'}
                                                      labelPlacement={'right'} value={'ph'}/>
                                    <FormControlLabel control={<Radio color={"default"}/>} label={'PPG/SKU'}
                                                      labelPlacement={'right'} value={'ppgsku'}/>
                                </RadioGroup>
                            </div>
                            :
                            this.state.selectedGrid === 'ph' ?
                                <div style={{width: '150vh', height: '70vh'}}>
                                    <ProductGrid columnDefs={this.columnDefsPH}
                                                 headerName={'Category/Subcategory/Subbrand/Variant/PPG/SKU'}
                                                 selectedProds={this.selectedProds}
                                                 deleteProd={this.deleteProd}/>
                                </div>
                                :
                                <div style={{width: '150vh', height: '70vh'}}>
                                    <ProductGrid columnDefs={this.columnDefsPPGSKU}
                                                 headerName={'Category/Subcategory/PPG/SKU'}
                                                 selectedProds={this.selectedProds}
                                                 deleteProd={this.deleteProd}/>
                                </div>
                        }
                    </CustomizedDialog>
                </Grid>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentEvent: state.Event.currentEvent,
    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPicker);