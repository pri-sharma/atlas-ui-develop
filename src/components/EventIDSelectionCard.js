import {CardContent, withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {KeyboardArrowUp} from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import React, {Component} from "react";
import CloseIcon from '@material-ui/icons/Close';
import {connect} from 'react-redux';
import * as actions from "../redux/bvp/actions";
import * as eventActions from '../redux/events/actions';

const TAB_OPTIONS = {
    BVP: 'baseline_volume_planning',
    TP: 'promoevent',
    BSP: 'bspevent'
};

class EventIDSelectionCard extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // if(this.props.tab === TAB_OPTIONS.TP){
        //     this.state = this.props.tpSelectedOptions
        // } else if(this.props.tab === TAB_OPTIONS.BSP){
        //     this.state = this.props.bspSelectedOptions
        // } else if (this.props.tab === TAB_OPTIONS.BVP) {
        //     this.state = this.props.bvpSelectedOptions
        // } else {
        //     this.state = {
        //         category: [],
        //         subcategory: [],
        //         subbrand: [],
        //         ppg: [],
        //         sku: [],
        //     };
        // }
        this.state = {
                category: [],
                subcategory: [],
                subbrand: [],
                ppg: [],
                sku: [],
            };
        this.style = this.props.style;
        this.selections = this.props.input;
        this.baseState = this.state
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props !== nextProps || this.state !== nextState) {
            this.selections = nextProps.options;
            this.state = this.baseState;
            return true;
        }
        return false;
    };

    handleChange = name => event => {
        const temp = [];
        for(let i = 0; i < event.target.value.length; i++)
        {
            temp.push(event.target.value[i]);
        }
        this.setState({[name]: temp});
    };


    handleDelete = (name, chipToDelete,arr) => ()=>{
        const temp = arr.filter(function (value) {
            return value !== chipToDelete

        });
        this.setState({[name]:temp});
    };

    handleClick = (tab) => {
        tab === TAB_OPTIONS.BVP ? this.props.getBvps(this.state) : tab === TAB_OPTIONS.BSP ?
            this.props.getEvents('BSP', this.props.customer, this.state)
            : this.props.getEvents('TP', this.props.customer, this.state)
    };

    render() {
        return (
            <Card style={this.style.smallCardStyle}>
                <CardContent>
                    <Typography style={this.style.titlefontStyle}>
                        Event ID Selection
                    </Typography>

                    <Grid container spacing={2} style={{marginTop: '1.63%', marginLeft: '1.15%'}}>
                        <Grid item xs={6}>
                            <InputLabel style={this.style.inputLabelStyle}>Category</InputLabel>
                            <Select
                                multiple={true}
                                autoWidth={true}
                                displayEmpty={true}
                                value={this.state.category}
                                style={{height: '25px', marginTop: '0.91%'}}
                                onChange={this.handleChange('category')}

                                renderValue={options => (
                                    <div>
                                        {
                                            options.map(value => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size='small'
                                                    style={{
                                                        backgroundColor: 'rgba(147,213,241, 0.8)',
                                                        color: ' rgba(29,161,218, 0.8)'
                                                    }}
                                                    deleteIcon={ <CloseIcon style={{color:'rgba(29,161,218, 0.8)'}}/> }
                                                    onDelete={this.handleDelete('category', value, this.state.category)}
                                                />

                                            ))}
                                    </div>
                                )}
                            >
                                {this.selections.category.map(category => (
                                    <MenuItem key={category} value={category}
                                              style={{color: ' rgba(29,161,218, 0.8)'}}>
                                        {category}
                                    </MenuItem>
                                ))}

                            </Select>
                        </Grid>

                        <Grid item xs={6}>
                            <InputLabel style={this.style.inputLabelStyle}>PPG</InputLabel>
                            <Select
                                multiple={true}
                                autoWidth={true}
                                displayEmpty={true}
                                value={this.state.ppg}
                                style={{height: '25px', marginTop: '0.91%'}}
                                onChange={this.handleChange('ppg')}

                                renderValue={options => (
                                    <div>
                                        {
                                            options.map(value => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size='small'
                                                    style={{
                                                        backgroundColor: 'rgba(147,213,241, 0.8)',
                                                        color: ' rgba(29,161,218, 0.8)'
                                                    }}
                                                     deleteIcon={ <CloseIcon style={{color:'rgba(29,161,218, 0.8)'}}/> }
                                                    onDelete={this.handleDelete('ppg', value, this.state.ppg)}
                                                />
                                            ))}
                                    </div>
                                )}
                            >
                                {this.selections.ppg.map(value => (
                                    <MenuItem key={value} value={value}
                                              style={{color: ' rgba(29,161,218, 0.8)'}}>
                                        {value}
                                    </MenuItem>
                                ))}

                            </Select>
                        </Grid>

                        <Grid item xs={6}>
                            <InputLabel style={this.style.inputLabelStyle}>Sub Category</InputLabel>
                            <Select
                                multiple={true}
                                autoWidth={true}
                                displayEmpty={true}
                                value={this.state.subcategory}
                                onChange={this.handleChange('subcategory')}
                                style={{height: '25px', marginTop: '0.91%'}}
                                renderValue={options => (
                                    <div>
                                        {
                                            options.map(value => (
                                                <Chip key={value}
                                                      label={value}
                                                      size='small'
                                                      style={{
                                                          backgroundColor: 'rgba(147,213,241, 0.8)',
                                                          color: ' rgba(29,161,218, 0.8)'
                                                      }}
                                                       deleteIcon={ <CloseIcon style={{color:'rgba(29,161,218, 0.8)'}}/> }
                                                    onDelete={this.handleDelete('subcategory', value, this.state.subcategory)}
                                                />
                                            ))}
                                    </div>
                                )}>
                                {this.selections.subcategory.map(sub => (
                                    <MenuItem key={sub} value={sub} style={{color: ' rgba(29,161,218, 0.8)'}}>
                                        {sub}
                                    </MenuItem>
                                ))}

                            </Select>
                        </Grid>

                        <Grid item xs={6}>
                            <InputLabel style={this.style.inputLabelStyle}>SKU</InputLabel>
                             <Select
                                 multiple={true}
                                autoWidth={true}
                                displayEmpty={true}
                                value={this.state.sku}
                                style={{height: '25px', marginTop: '0.91%'}}
                                onChange={this.handleChange('sku')}

                                renderValue={options => (
                                    <div>
                                        {
                                            options.map(value => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size='small'
                                                    style={{
                                                        backgroundColor: 'rgba(147,213,241, 0.8)',
                                                        color: ' rgba(29,161,218, 0.8)'
                                                    }}
                                                    deleteIcon={ <CloseIcon style={{color:'rgba(29,161,218, 0.8)'}}/> }
                                                    onDelete={this.handleDelete('sku', value, this.state.sku)}
                                                />
                                            ))}
                                    </div>
                                )}
                            >
                                {this.selections.sku.map(value => (
                                    <MenuItem key={value} value={value}
                                              style={{color: ' rgba(29,161,218, 0.8)'}}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={6}>
                            <InputLabel style={this.style.inputLabelStyle}>Sub Brand</InputLabel>
                            <Select
                                multiple={true}
                                autoWidth={true}
                                displayEmpty={true}
                                value={this.state.subbrand}
                                onChange={this.handleChange('subbrand')}
                                style={{height: '25px', marginTop: '0.91%'}}
                                renderValue={options => (
                                    <div>
                                        {
                                            options.map(value => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size='small'
                                                    style={{
                                                        backgroundColor: 'rgba(147,213,241, 0.8)',
                                                        color: ' rgba(29,161,218, 0.8)'
                                                    }}
                                                     deleteIcon={ <CloseIcon style={{color:'rgba(29,161,218, 0.8)'}}/> }
                                                    onDelete={this.handleDelete('subbrand', value, this.state.subbrand)}
                                                />
                                            ))}
                                    </div>
                                )}>
                                {this.selections.subbrand.map(bd => (
                                    <MenuItem key={bd} value={bd} style={{color: ' rgba(29,161,218, 0.8)'}}>
                                        {bd}
                                    </MenuItem>
                                ))}

                            </Select>
                        </Grid>
                    </Grid>

                    <Button style={this.style.buttonStyle} onClick={() => this.handleClick(this.props.tab)}>
                        APPLY SELECTION
                    </Button>

                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        options: state.Event.eventSelectionOptions,
        tab: state.App.currentTab,
        customer: state.PlannableCustomers.selectedCustomer,
        tpSelectedOptions: state.Event.tpSelectedOptions,
        bspSelectedOptions: state.Event.bspSelectedOptions,
        bvpSelectedOptions: state.Bvp.bvpSelectedOptions
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getBvps: (options) => dispatch(actions.getBvpsAction(options)),
        getEvents: (event_type, customer, options) => dispatch(eventActions.getEvents(event_type, customer, options))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventIDSelectionCard);