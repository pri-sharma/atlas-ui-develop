import React, {Component, Fragment} from 'react';
import Card from '@material-ui/core/Card';
import KPICard from '../../components/KPICard';
import {connect} from "react-redux";
import EventIDSelectionCard from '../../components/EventIDSelectionCard';
import {KeyboardArrowUp} from "@material-ui/icons";
import NavigationIcon from "@material-ui/icons/Navigation"
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab';
import LayoutContentWrapper from "../../components/utility/layoutWrapper.style";
import * as actions from '../../redux/events/actions';


const collapseButtonStyle = {
    borderRadius: '42%',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%, 50%)',
    backgroundColor: 'rgba(237,248,253, 0.8)',
    borderColor: 'rgba(237,248,253, 0.8)',
    minWidth: 'unset',
    width: '2.5rem',
    padding: 0,
};

const cardStyle = {
    width: '100%',
    overflow: 'unset',
    height: '289px',
    marginBottom: '32px',
    marginTop: '32px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    boxShadow: '0px 4px 9px rgba(0, 0, 0, 0.16)',
};

const smallCardStyle = {
    width: '50%',
    height: '100%',
    marginBottom: '32px',
    marginTop: '0px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    display: 'inline-block'
};

const titlefontStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: '500',
    marginTop: '0.795%',
    marginLeft: '1.59%'
};

const inputLabelStyle = {
    fontFamily: 'Roboto',
    fontSize: '12px',
    color: 'rgba(0,0,0,1)',
    fontWeight: 'normal',
    lineHeight: '122.69%',

};

const buttonStyle = {
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '14px',
    marginLeft: '73.7%',
    marginTop: '5.7%',
    color: 'rgba(29,161,218, 0.8)',
    position: 'static'

};

const style = {
    'smallCardStyle': smallCardStyle, 'titlefontStyle': titlefontStyle,
    'inputLabelStyle': inputLabelStyle, 'buttonStyle': buttonStyle
};

const dummyKPIs = ['Volume(Cs)', 'Net Sales', 'GTN[%]', 'Margin[%]'];

const dummyData = [
    {title: '2018 [FY]', 'Volume(Cs)': '4 000k', 'Net Sales': '46 000k', 'GTN[%]': '31.0', 'Margin[%]': '64.0'},
    {title: '2019 [FY]', 'Volume(Cs)': '4 400k', 'Net Sales': '50 000k', 'GTN[%]': '33.1', 'Margin[%]': '62.3'},
    {title: 'SLE vs Budget', 'Volume(Cs)': '-10%', 'Net Sales': '-12%', 'GTN[%]': '+2.1', 'Margin[%]': '-2.2'},
    {title: '2019 vs 2018 [FY]', 'Volume(Cs)': '+10%', 'Net Sales': '+8.7%', 'GTN[%]': '+2.1', 'Margin[%]': '-1.7'}
];


const selections = {
    'category': [],
    'subcategory': [],
    'subbrand': [],
    'ppg': [], 'sku': []
};

const TAB_OPTIONS = {
    BVP: 'baseline_volume_planning',
    TP: 'promoevent',
    BSP: 'bspevent'
};

class BSPEventIDSelection extends Component {

    constructor(props) {
        super(props);

        this.props.currentTab === TAB_OPTIONS.BVP ? this.props.getBvpOptions() :
            this.props.currentTab === TAB_OPTIONS.BSP ? this.props.getEventOptions('BSP', this.props.customer_id) :
                this.props.getEventOptions('TP', this.props.customer_id);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.customer_id !== nextProps.customer_id || this.props.start_date !== nextProps.start_date || this.props.end_date !== nextProps.end_date){
            this.props.currentTab === TAB_OPTIONS.BVP ? this.props.getBvpOptions() :
            this.props.currentTab === TAB_OPTIONS.BSP ? this.props.getEventOptions('BSP', nextProps.customer_id) :
                this.props.getEventOptions('TP', nextProps.customer_id);
            return true
        }
        return false
    }

    render() {
        return (
            <Card className={'clearfix'} style={cardStyle}>
                <EventIDSelectionCard style={style} input={this.props.options} tab={this.props.currentTab}/>
                <KPICard style={smallCardStyle} title={`Total Plan KPI's`}
                         columns={dummyKPIs}
                         rows={dummyData}
                />
                <Button variant='contained' size='small' style={collapseButtonStyle}>
                    <KeyboardArrowUp style={{color: 'rgba(29,161,218, 0.8)'}}/>
                </Button>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentTab: state.App.currentTab,
        customer_id: state.PlannableCustomers.selectedCustomer,
        options: state.Event.eventSelectionOptions,
        start_date: state.Bvp.startDate,
        end_date: state.Bvp.endDate
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getEventOptions: (event_type, customer_id) => dispatch(actions.getEventSelectionOptionsAction(event_type, customer_id)),
        getBvpOptions: () => dispatch(actions.getBvpOptions())
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BSPEventIDSelection);