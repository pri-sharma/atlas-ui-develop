import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CustomizedDialog from '../customizedDialog/CustomizedDialog';
import Spends from '../../images/Spends.png';
import EmptyCart from '../../images/EmptyCart.png';
import {Styled} from './SpendPicker.style';
import {ListSubheader} from '@material-ui/core';

const colObjs = [
    {stateProp: 'customizedOIColumns', type: 'OI', label: 'Off Invoice (OI)'},
    {stateProp: 'customizedVRColumns', type: 'VR', label: 'Variable Rebate (VR)'},
    {stateProp: 'customizedFXColumns', type: 'FX', label: 'Fixed Amount (FX)'}];

export default class SpendPicker extends Component {

    constructor(props) {
        super(props);

        const currentCols = this.props.spends;
        this.currentOICols = (currentCols.OI) ? [...currentCols.OI] : [];
        this.currentVRCols = (currentCols.VR) ? [...currentCols.VR] : [];
        this.currentFXCols = (currentCols.FX) ? [...currentCols.FX] : [];
        this.updateRHSList({OI: this.currentOICols, VR: this.currentVRCols, FX: this.currentFXCols});
        this.state = {
            customizedOIColumns: [],
            customizedVRColumns: [],
            customizedFXColumns: [],
            isCustomizeOpen: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        return false;
    };

    updateRHSList({OI = this.state.customizedOIColumns, VR = this.state.customizedVRColumns, FX = this.state.customizedFXColumns}) {
        const all = [...OI, ...VR, ...FX];
        this.selectedCols = all.reduce((acc, col) => (col.checked) ? [...acc, col] : [...acc], []);
    }

    updateResults(col, colObj, listResult, stateResult) {
        const cols = this.state[colObj.stateProp].map((obj) => {
            if (obj.value === col.value) {
                obj.checked = !obj.checked;
            }
            return obj;
        });
        listResult[colObj.type] = cols;
        stateResult[colObj.stateProp] = cols;
    }

    updateLHSCheckbox = col => event => {
        const listResult = {};
        const stateResult = {};

        const colArray = colObjs.filter(obj => obj.type===col.type);
        this.updateResults(col, colArray[0], listResult, stateResult);

        this.updateRHSList(listResult);
        this.setState(stateResult);
    }

    /**
     * Customize table checkbox selection handler, sets checked flag in customized columns
     * @param col
     * @returns {Function}
     */
    onCustomizeTableCheck = col => event => {
        const listResult = {};
        const stateResult = {};

        colObjs.forEach(colObj => {
            this.updateResults(col, colObj, listResult, stateResult);
        });

        this.updateRHSList(listResult);
        this.setState(stateResult);
    };

    /**
     * Customize table Apply onClick handler, update currentCols, reset the customizedColumns state, and update grid
     */
    onApply = () => {
        this.currentOICols = this.state.customizedOIColumns;
        this.currentVRCols = this.state.customizedVRColumns;
        this.currentFXCols = this.state.customizedFXColumns;
        this.setState({
            isCustomizeOpen: false,
            customizedOIColumns: [],
            customizedVRColumns: [],
            customizedFXColumns: [],
        });
        this.props.customSpendsCB(this.currentOICols, this.currentVRCols, this.currentFXCols);
    };

    /**
     * Customize table button handler, set state to opened and clone copy the currentCols
     * @param event
     */
    onOpen = (event) => {
        this.updateRHSList({OI: this.currentOICols, VR: this.currentVRCols, FX: this.currentFXCols});
        this.setState({
            isCustomizeOpen: true,
            customizedOIColumns: cloneColumns(this.currentOICols),
            customizedVRColumns: cloneColumns(this.currentVRCols),
            customizedFXColumns: cloneColumns(this.currentFXCols),
        });
    };

    /**
     * Customize table button even handler, set state to closed and throw away the customizedColumns state changes
     * @param event
     */
    onCancel = (event) => {
        this.setState({
            isCustomizeOpen: false,
            customizedOIColumns: [],
            customizedVRColumns: [],
            customizedFXColumns: [],
        });
    };

    render() {
        return (<Grid item>
                <Button onClick={this.onOpen} style={{fontSize: '.8rem'}}>
                    <AttachMoneyIcon fontSize={'small'} style={{color: 'black'}}/>
                    Manage Spends
                </Button>
                <CustomizedDialog onClose={this.onCancel}
                                  open={this.state.isCustomizeOpen}
                                  img={Spends}
                                  title={'Manage Spends'}
                                  submitText={'APPLY'}
                                  onSubmit={this.onApply}>
                    <Styled.CustomizeContent>
                        <div className='content-card-left'>
                            <Typography variant={'h6'} className='content-title'>
                                Select Spend
                            </Typography>
                            <Paper>
                                {colObjs.map(colObj =>
                                    (<div key={colObj.stateProp}>
                                        {(this.state[colObj.stateProp].length > 0) ?
                                            <ListSubheader>{colObj.label}</ListSubheader> : null}
                                        <List dense={true} className='content-card-left-subcontent'>
                                            {this.state[colObj.stateProp].map((col) => (
                                                <ListItem key={col.id}>
                                                    <ListItemIcon>
                                                        <Checkbox color='primary'
                                                                  checked={col.checked}
                                                                  disabled={col.disabled}
                                                                  onChange={this.onCustomizeTableCheck(col)}/>

                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={col.value}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>)
                                )}
                            </Paper>
                        </div>
                        <div className='content-card-right'>
                            {(this.selectedCols.length > 0) ?
                                <Typography variant={'h6'} className='content-title'>
                                    Spends Added ({this.selectedCols.length})
                                </Typography> : <Typography variant={'h6'} className='content-title'>
                                    Spends Added
                                </Typography>
                            }
                            {(this.selectedCols.length > 0) ?
                                <Paper>
                                    <List dense={true}>
                                        {this.selectedCols.map((col, index) => (
                                            <ListItem key={col.id}>
                                                <ListItemText
                                                    primary={col.value}/>
                                                <ListItemSecondaryAction>
                                                    <IconButton edge='end' aria-label='delete'
                                                                disabled={col.disabled}
                                                                onClick={this.updateLHSCheckbox(col)}>
                                                        <DeleteOutlinedIcon/>
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper> : <Paper className='content-card-right-subcontent'>
                                    <img className='content-card-right-subcontent-image' src={EmptyCart} alt='Empty Cart Icon'/>
                                    <Typography className='content-card-right-subcontent-text'>Looks like you have no spends for this event?</Typography>
                                    <Typography className='content-card-right-subcontent-text-sub'>Start by selecting your spends</Typography>
                                </Paper>}
                        </div>
                    </Styled.CustomizeContent>
                </CustomizedDialog>
            </Grid>
        )
    }
}

function cloneColumns(initialCols) {
    return initialCols.map(col => {
        return {...col};
    });
}