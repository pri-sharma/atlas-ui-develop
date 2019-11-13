// This Container is the structure for the filters bar above the grids.
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/events/actions';
import * as bvpActions from '../../redux/bvp/actions';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import {DatePicker, Icon} from 'antd';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FilterComponent from './FilterComponent';
import {Styled} from './FiltersContainer.styles';

const TAB_OPTIONS = {
    BVP: 'baseline_volume_planning',
    TP: 'promoevent',
    BSP: 'bspevent'
};

class FiltersContainer extends Component {
    constructor(props) {
        super(props);

        const dateFormat = 'YYYY/MM/DD';
        const getMomentYear = moment().year();
        this.startDate = moment(getMomentYear + '/01/01', dateFormat);
        this.endDate = moment(getMomentYear + '/12/31', dateFormat);
        this.props.setSelectedDates(this.startDate, this.endDate);

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
        this.getOptionsByTab();
    }

    getOptionsByTab = () => {
        this.props.currentTab === TAB_OPTIONS.BVP ? this.props.getBvpOptions() :
            this.props.currentTab === TAB_OPTIONS.BSP ? this.props.getEventOptions('BSP', this.props.customer_id) :
                this.props.getEventOptions('TP', this.props.customer_id);
    };

    getFilteredByTab = (currentSelections) => {
        this.props.currentTab === TAB_OPTIONS.BVP ? this.props.getBvps(currentSelections) :
            this.props.currentTab === TAB_OPTIONS.BSP ? this.props.getEvents('BSP', this.props.customer_id, currentSelections) :
                this.props.getEvents('TP', this.props.customer_id, currentSelections);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!isEqual(this.props.options, nextProps.options)) {
            this.getOptionsByTab();
            return true;
        } else if (!isEqual(nextState.currentOptions, this.state.currentOptions)
            || !isEqual(nextState.currentFilter, this.state.currentFilter)) {
            return true;
        }
        return false;
    }

    mapOptionsToState = () => {
        /**
         * Purpose: Convert the list of product attributes in this.props.options to a dict of unique lists, usable for filter options
         * Return Example: {
         *     'sku': [{'id': 1, 'description': 'ABC'}, {'id': 2, 'description': 'DEF'},...]
         *     'ppg': [{'id': 50, 'description': 'UNG'}],
         *     ...
         *     }
         */
        if (this.props.options.length > 0) {
            let currentOptionsDict = {};
            let newOptions = this.updateCurrentOptions(this.state.currentFilter);
            Object.keys(this.state.currentOptions).forEach(option => {
                let optionArray = [];
                newOptions.forEach(product => {
                    let pairedDictionary = {};
                    pairedDictionary['id'] = product[`${option}_id`];
                    pairedDictionary['description'] = product[`${option}_description`];
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
        let newFilter = {};
        let currentSelections = this.state.filteredOn;

        Object.keys(checked).forEach(id => filter.push(id));
        newFilter[categoryType] = checked;
        currentSelections[categoryType] = filter;

        this.setState({filteredOn: currentSelections});
        let newFilters = {...this.state.currentFilter, ...newFilter};
        this.setState({currentFilter: newFilters});

        this.getFilteredByTab(currentSelections);
        this.updateCurrentOptions(newFilters);
    };

    updateCurrentOptions = (currentFilter) => {
        let newOptions = [];

        this.props.options.forEach(product => {
            Object.keys(currentFilter).forEach(key => {
                Object.keys(currentFilter[key]).forEach(id => {
                    if (id === product[`${key}_id`].toString()) {
                        newOptions.push(product)
                    }
                })
            })
        });
        return newOptions.length > 0 ? newOptions : this.props.options;
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
        this.getFilteredByTab(resetOptions);
        this.cleared = true;
        this.updateCurrentOptions(resetOptions);
    };

    handleDateRangeChange = (dateRange, dateRangeString) => {
        if (dateRangeString[0].length !== 0 && dateRangeString[1].length !== 0) {
            this.startDate = dateRange[0];
            this.endDate = dateRange[1];
            this.props.setSelectedDates(this.startDate, this.endDate);
             this.getFilteredByTab(this.state.filteredOn);
        }
    }

    createFilterComponents = () => {
        let components = [];

        // TODO - need to sort them to guarantee order
        Object.entries(this.state.currentOptions).map(([key, value]) => {
            components.push(<FilterComponent values={value}
                                             checked={this.state.currentFilter[key]}
                                             cleared={this.cleared}
                                             key={key}
                                             categoryType={key} onApply={this.handleApply}/>);
        });
        return components;
    };

    render() {
        this.mapOptionsToState();

        const dateFormat2 = 'MMMM D YYYY';
        const suffix = <Icon type='caret-down'/>;
        return (
            <Styled.CustomForm autoComplete='off'>
                <FormControl className='filteredFilters'>
                    <div className='filteredFiltersComponents'>
                        {this.props.prodpicker ?
                            null
                            :
                            <DatePicker.RangePicker
                                defaultValue={[this.startDate, this.endDate]}
                                format={dateFormat2}
                                onChange={this.handleDateRangeChange}
                                allowClear={false}
                                suffixIcon={suffix}
                                separator='-'
                            />
                        }
                        {this.createFilterComponents()}
                        <FilterComponent
                            values={[]}  // More Filters Select
                            checked={{}}
                            cleared={false}
                            categoryType={'more'}
                            key={'more'}
                            onApply={this.handleApply}/>

                        <Button style={{
                            display: 'inline-block',
                            maxWidth: '8%',
                            minWidth: '8%',
                            right: '-1%'
                        }} onClick={this.handleClear}>
                            CLEAR
                        </Button>
                    </div>
                </FormControl>
            </Styled.CustomForm>

        )
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
        getBvpOptions: () => dispatch(actions.getBvpOptions()),
        getBvps: (selections) => dispatch(bvpActions.getBvpsAction(selections)),
        getEvents: ((event_type, customer, options) => dispatch(actions.getEvents(event_type, customer, options))),
        setSelectedDates: (startDate, endDate) => dispatch(bvpActions.setSelectedDatesAction(startDate, endDate)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FiltersContainer);
