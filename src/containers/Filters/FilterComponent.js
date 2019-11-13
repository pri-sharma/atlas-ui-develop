import React, {Component} from 'react';
import {createStyles, withStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';
import './override_menu_select.css';

export const BootstrapInput = withStyles((theme) =>
    createStyles({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
                marginBottom: theme.spacing(3),
                minWidth: '100%',
                maxWidth: '100%'
            },

        },
        input: {
            minWidth: '100%',
            maxWidth: '100%',
            height: '70%',
            borderRadius: '3px',
            position: 'relative',
            backgroundColor: 'transparent',
            border: '1px solid #ced4da',
            fontSize: '14px',
            padding: '5px 26px 5px 12px',
            right: '1%',
            left: '0%',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            fontFamily: 'Roboto',
            boxSizing: 'border-box',
            '&:focus': {
                borderRadius: '3px',
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    }),
)(InputBase);

const titles = {
    sku: 'SKU',
    ppg: 'PPG',
    category: 'Category',
    subcategory: 'Sub Category',
    subbrand: 'Brand',
    more: 'More Filters'
};

const buttonStyle = {
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '14px',
    marginLeft: '74.7%',
    marginTop: '5.7%',
    color: 'rgba(29,161,218, 0.8)',
    width: 'inherit',
    top: `${window.innerHeight / 14.5}px`
};

class FilterComponent extends Component {
    constructor(props){
        super(props);

        this.state = {
            checked: this.props.checked,
            open: false,
            cleared: this.props.cleared,
        };

        this.wasApplied = false;
    }

    selectStyles = () => {
        let checked = pickBy(this.state.checked, (value) => value);
        let isChecked = Object.keys(checked).length === 0;
        let backgroundColor = isChecked ? '#FCFCFC' :'#38B1E5';
        let textColor = isChecked ? '#3D4551' : '#FCFCFC';

        return {
            color: textColor,
            backgroundColor: backgroundColor,
            height: 'fit-content',
            minWidth: '15vh'
        }
    };

    dropDownArrowStyles = () => {
        let checked = pickBy(this.state.checked, (value) => value);
        let color = Object.keys(checked).length === 0 ? '#3D4551' :'#FCFCFC';

        return {
            color: color,
            right: '15%',
            fontSize: '100%',
            position: 'relative',
            cursor: 'pointer'
        }
    };

    dropDownDivStyles = () => {
        return {minWidth: `${window.innerWidth / 4}px`,
                maxWidth: `${window.innerWidth / 4}px`,
                maxHeight: `${window.innerHeight / 2.5}px`,
                minHeight: `${window.innerHeight / 2.5}px`,
                paddingLeft: '5%'
        }
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.cleared){
            // TODO - should not set state directly but currently clearing Filter will break if using setState
            this.state.checked = [];
        }
        if(!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)){
            return true;
        }
        return false;
    }

    handleChange = (id) => event => {
        let newDict = {};
        newDict[id] = event.currentTarget.checked;
        let checked = {...this.state.checked, ...newDict};
        this.setState({checked: checked});
    };

    handleClose = () => {
        !this.wasApplied ? this.setState({checked: this.props.checked}) : this.wasApplied = false;
        this.setState({open: !this.state.open, cleared: false});
    };

    render() {
        return (
                    <Select
                        style={this.selectStyles()}

                        multiple
                        value={(this.props.values.length===0)?[{'id': 'abc', 'description': 'description'}]:this.props.values}
                        onChange={this.props.onChange}
                        input={<BootstrapInput className={'filter'}/>}
                        onClose={this.handleClose}
                        onOpen={this.handleClose}
                        open={this.state.open}
                        IconComponent={() => <ArrowDropDownIcon onClick={this.handleClose} style={this.dropDownArrowStyles()}/>}
                        renderValue={(values) => {
                            let checked = pickBy(this.state.checked, (value) => value);
                            let numChecked = Object.keys(checked).length;
                            let checkedKey = Object.keys(checked)[0];


                            if(numChecked === 1 && this.state.checked[checkedKey]){
                                let obj = values.find(obj => obj.id.toString() === checkedKey);
                                return `${obj.description ? obj.description : obj.id}`;
                            }else if (numChecked > 1){
                                return `${titles[this.props.categoryType]} | ${numChecked}`;
                            }else {
                                return `${titles[this.props.categoryType]}`;
                            }
                        }}
                        MenuProps={{style: {top: `${window.innerHeight / 5.9}px`, left: '.5%', }}}
                    >
                        {this.state.open ?
                        <div style={this.dropDownDivStyles()}>
                            <span><SearchIcon/><Input/></span>
                            <FormGroup style={{minHeight: `${window.innerHeight / 4.5}px`, maxHeight: `${window.innerHeight / 4.5}px`,
                                                display: 'inline-block', width: '80%', overflowX: 'hidden', overflowY: 'scroll'}}>
                                {this.props.values.map(value => {
                                    return <FormControlLabel
                                        style={{width: '100%'}}
                                        control={<Checkbox color='primary'
                                                    checked={this.state.checked[value.id]}
                                                    onChange={this.handleChange(value.id)} value={value.id}/>}
                                        label={value.description ? value.description : value.id}
                                    />

                                })}
                            </FormGroup>
                            <Button style={buttonStyle} onClick={() => {
                                this.wasApplied = true;
                                this.handleClose();
                                this.props.onApply(this.props.categoryType, pickBy(this.state.checked, (value) => value)) // returns only values that are true
                            }}>
                                APPLY
                            </Button>
                        </div> : null}
                    </Select>
        )
    }
}

export default FilterComponent;
