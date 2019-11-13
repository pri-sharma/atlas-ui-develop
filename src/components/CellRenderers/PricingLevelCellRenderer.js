import React, {Component} from 'react';
import {connect} from 'react-redux';
import MenuItem from "@material-ui/core/MenuItem/index";
import Select from "@material-ui/core/Select/index";
import * as actions from '../../redux/events/actions';

class PricingLevelCellRenderer extends Component {
    constructor(props){
        super(props);
        if(!this.props.node.allChildrenCount && !this.props.node.isRowPinned()){ // In case PricingLevelCellRenderer is called in PPG row (allChildrenCount != null)
            this.data = this.props.data;
            this.state = {
                pricing_level: this.data.pricing_level,
                parent_pricing: this.props.node.parent.pricing_level
                };
        }else if(!this.props.node.isRowPinned()){
            this.state = {
                pricing_level: this.props.node.allLeafChildren['0'].data.pricing_level, //gets the pricing_level form first sku child since all skus will have the same value
                parent_pricing: null
            };
            this.props.node.pricing_level = this.state.pricing_level;
        }
    }

    handleChange = (e) => {
            this.setState({
                pricing_level: e.target.value
            });
            for (let i = 0; i < this.props.node.allLeafChildren.length; i++) {
                this.props.updateEventPricingLevel(this.props.node.allLeafChildren[i].data.id, e.target.value) //updates pricing_level in all child skus
            }
        };

    render(){
        if(!this.props.node.isRowPinned()){ //do not render when top pinned row
            if(this.state.parent_pricing === null){ //do not render for every sku, just for ppg row
                return(
                    <Select disableUnderline={true} value={this.state.pricing_level} onChange={this.handleChange.bind(this)}>
                        <MenuItem value={'PPG'}>PPG</MenuItem>
                        <MenuItem value={'SKU'}>SKU</MenuItem>
                    </Select>)
            }

        }
        return null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateEventPricingLevel: (event_id, newStatus) => dispatch(actions.updateEventPricingLevel(event_id, newStatus))
    }
};


export default connect(null, mapDispatchToProps)(PricingLevelCellRenderer);

