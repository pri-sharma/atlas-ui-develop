import React, {Component} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {connect} from 'react-redux';
import * as action from '../../redux/events/actions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import ProdPickerFiltersContainer from '../../containers/Filters/ProdPickerFiltersContainer';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {Styled} from './ProductGrid.style'
import ShoppingCart from '../../images/ShoppingCart.png';
import BrushIcon from "../../images/Brush.png";


class ProductGrid extends Component {
    constructor(props){
        super(props);

        this.props.getPlannableProducts(this.props.customer);

        this.state = {
            columnDefs: this.props.columnDefs,
            open: false,
            previous: this.props.currentEvent.eventproducts_set.map((item) => item.productnode),
            selected: []
        };
    }

    selectPrevProds = (params) => {
        if(params){
            for(let i = 0; i < this.state.previous.length; i++){
                if(params.data.material_number === this.state.previous[i].material_number){
                    return false
                }
            }
        }
        return true
    };

    prodDescGetter = (params) => {
            let product = params.data;
            let sku = product['material_number'] ? product['material_number'].replace(/^0+/, '') : '';
            let desc = product['description_set'].find(d => d.language === 'EN').description;
            return `${sku} - ${desc}`;
    };

    onSearch = (event) => {
        if (event.type === 'click' || event.keyCode === 13) {
            this.api.setQuickFilter(document.getElementById('prod_picker_search_input').value);
        }
    };

    isChecked = () => {
        const selection = this.api.getSelectedRows();
        if (selection.length > 0) {
            this.setState({
                isSelected: true,
                selected: selection
            });
            this.props.selectedProds(this.state.selected);
        } else {
            this.setState({
                isSelected: false,
                selected: []
            });
        }
    };

    handlePopoverOpen = (event) => {
        event.preventDefault();
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handlePopoverClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    onDelete = (sku) => {
        this.setState({
            previous: this.state.previous.filter(function(product) {
                return product.material_number !== sku
            })
        });
        const prod = this.props.currentEvent.eventproducts_set.find((prod) => sku === prod.productnode.material_number ? prod : null);
        this.props.deleteProd(prod.id);
    };

    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;
    };


    render(){
        const open = Boolean(this.state.anchorEl);
        const totalProds = this.state.previous.length + this.state.selected.length;
        return(
            <LayoutContentWrapper style={{
                height: '86%',
                width: '98%',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'}}>
                <Grid container direction={'column'} spacing={4} style={{marginRight: 25}}>
                    <Grid container direction={'row'} justify={'space-between'} style={{marginLeft: 25}}>
                        <Grid item>
                            <Input id={'prod_picker_search_input'} style={{height: 40, width: 300}} onKeyUp={this.onSearch} startAdornment={
                                <InputAdornment position={'start'}>
                                    <IconButton onClick={this.onSearch}>
                                        <SearchIcon fontSize={'small'}/>
                                    </IconButton>
                                </InputAdornment>
                            }/>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant={'button'}>
                                Added Products ({totalProds})
                                <IconButton size={'small'} onClick={this.handlePopoverOpen}>
                                    <ArrowDropDownIcon style={{color: 'black'}}/>
                                </IconButton>
                            </Typography>
                            <Popover
                                open={open}
                                anchorEl={this.state.anchorEl}
                                className='popover_class'
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                onClose={this.handlePopoverClose}>
                                {this.state.selected.length === 0 && this.state.previous.length === 0 ?
                                    <div style={{width:'40vh', height: '50vh', position: 'relative', marginTop: '13vh'}}>
                                        <Grid container direction={'column'} alignItems={'center'} spacing={2}>
                                            <Grid item xs>
                                                <img src={ShoppingCart} style={{width: 250, height: 200}}/>
                                            </Grid>
                                            <Grid container item xs direction={'column'} alignItems={'center'}>
                                                <Grid item xs >
                                                    <Typography variant={'subtitle2'}>Looks like you have no products for this event?</Typography>
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography variant={'caption'} color={'textSecondary'}>Start by selecting your products</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    :
                                    <List style={{width: '100%', maxWidth: 400, position: 'relative', overflow: 'auto', maxHeight: 500}} subheader={<li />} dense={true}>
                                        <li key={`section-1`} style={{backgroundColor: 'white'}}>
                                            <ul style={{backgroundColor: 'white'}}>
                                                <ListSubheader>Recently Added</ListSubheader>
                                                {this.state.selected.map((product) =>{
                                                    let sku = product['material_number'] ? product['material_number'].replace(/^0+/, '') : '';
                                                    let desc = product['description_set'].find(d => d.language === 'EN').description;
                                                    return(
                                                        <ListItem key={sku} alignItems={'flex-start'}>
                                                            <ListItemText secondary={sku + ' - ' + desc}/>
                                                        </ListItem>
                                                    )}
                                                )}
                                            </ul>
                                        </li>
                                        <li key={`section-2`} style={{backgroundColor: 'white'}}>
                                            <ul style={{backgroundColor: 'white', listStyleType: 'none'}}>
                                                <ListSubheader>Previously Added</ListSubheader>
                                                {this.state.previous.map((product) => {
                                                    let sku = product['material_number'] ? product['material_number'].replace(/^0+/, '') : '';
                                                    let desc = product['description_set'].find(d => d.language === 'EN').description;
                                                    return(
                                                        <ListItem key={sku}>
                                                            <ListItemText secondary={sku + ' - ' + desc}/>
                                                            <ListItemSecondaryAction>
                                                                <IconButton edge={'end'} aria-label={'delete'} size={'small'} onClick={this.onDelete.bind(this, sku)}>
                                                                    <DeleteIcon fontSize={'small'}/>
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    )}
                                                )}
                                            </ul>
                                        </li>
                                    </List>
                                }
                            </Popover>
                        </Grid>
                    </Grid>
                    <ProdPickerFiltersContainer/>
                </Grid>
                <Styled.ProductGridContent className='ag-theme-material'>
                    <AgGridReact
                        onGridReady={this.onGridReady}
                        columnDefs={this.state.columnDefs}
                        rowSelection={'multiple'}
                        groupSelectsChildren={true}
                        onRowSelected={this.isChecked}
                        isRowSelectable={this.selectPrevProds}
                        suppressRowClickSelection={true}
                        rowData={this.props.filteredProducts}
                        getRowHeight={() => {
                            return 40
                        }}
                        onFirstDataRendered={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                        getRowStyle={(params) => {
                            let color = params.node.rowIndex % 2 !== 0 ? '#EBEDF0' : '#fff';
                            return {'background-color': color}

                        }}
                        autoGroupColumnDef={{
                            headerName: this.props.headerName,
                            resizable: true,
                            filter: true,
                            valueGetter: this.prodDescGetter,
                            field: 'material_number',
                            menuTabs: ['filterMenuTab'],
                            icons: {menu: '<i class="material-icons">filter_list</i>'},
                            cellRenderer:'agGroupCellRenderer',
                            cellRendererParams: {
                                checkbox: true, // enable checkbox selection
                            }
                        }}
                    />
                </Styled.ProductGridContent>
            </LayoutContentWrapper>

        )
    }
}
const mapStateToProps = state => {
    return {
        currentEvent: state.Event.currentEvent,
        customer: state.PlannableCustomers.selectedCustomer,
        plannableProducts: state.Event.plannableProducts,
        filteredProducts: state.Event.filteredProducts,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPlannableProducts: (customer_id) => dispatch(action.getPlannableProducts(customer_id)),
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);