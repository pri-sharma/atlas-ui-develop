import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from "../redux/bvp/actions";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import {NumericCellEditor} from '../CellEditors';
import {Button, CircularProgress, IconButton} from '@material-ui/core'
import CustomizedSnackbar from './CustomizedSnackbar'
import ReactDOMServer from "react-dom/server";
import appActions from "../redux/app/actions";
import SaveIcon from '@material-ui/icons/Save';
import LaunchIcon from '@material-ui/icons/Launch';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Add from '@material-ui/icons/Add';
import Sync from '@material-ui/icons/Sync';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Fab from '@material-ui/core/Fab';
import TableChartIcon from '@material-ui/icons/TableChartOutlined'
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CustomizedDialog from './customizedDialog/CustomizedDialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import RootRef from "@material-ui/core/RootRef";
import CustomHeader from './CustomHeader';
import currency from 'currency.js';
import KeyFigureFilter from './KeyFigureFilter.js';
// import moment from "./EventGrid";
import moment from 'moment';
import {Link} from "react-router-dom";

const keyRegex = {
    YQ: '^y[2-9][0-9][0-9][0-9]q[1-4]$',
    YM: '^y[2-9][0-9][0-9][0-9]m[0-1][0-9]$',
    YMW: '^y[2-9][0-9][0-9][0-9]m[0-1][0-9]w[0-9][0-9]$',
};

const rule = {
    SUM: 'sum',
    AVG: 'avg',
    CONST: 'const',
};

const year = new Date().getFullYear();
let years = [];
for (let i = year; i <= year + 5; i++) {
    years.push(i);
}

class AssortmentGrid extends Component {
    constructor(props) {
        super(props);
        this.keyFigures = {}; // populated in onGridReady
        this.changedEntries = this.props.changedEntries; // track unsaved changed entries
        this.state = {
            columnDefs: null,
            changePending: false,
            bvps: [],
            isColumnMoving: false,
            customizeTableElement: null,
            columnGroups: [
                {id: 'sales_uom', value: 'UoM', checked: true},
                {id: 'ppg', value: 'PPG', checked: true},
                {id: 'material_number', value: 'SKU', checked: true}
            ],
        };

        this.currentStyle = false;
        this.baselineRowIds = [];
        this.groupHeader = 'UoM/PPG/SKU';
        this.columnApi = null;
        this.api = null;
        this.progressBarHtml = ReactDOMServer.renderToString(<CircularProgress/>);
        this.snackbar = null;

        // calculate current week/month/quarter to set editability
        const today = new Date();
        this.firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        this.currentDay = today.getDate();
        this.currentWeek = Math.ceil((((today - this.firstDayOfYear) / 86400000) + this.firstDayOfYear.getDay()) / 7);
        this.currentMonth = today.getMonth() + 1;
        this.currentQuarter = Math.ceil(this.currentMonth / 3);
        this.currentYear = today.getFullYear();
        this.horizontalDisaggRule = 'sum';
        this.verticalDisaggRule = 'sum';
        this.horizontalAggRule = 'sum';
        this.verticalAggRule = 'sum';

    }

    onGridReady = (params) => {
        this.baselineRowIds = [];
        for (const [key, value] of Object.entries(this.props.planningConfig.BVP)) {
            this.keyFigures[value['display_name']] = key;
        }
        this.columnApi = params.columnApi;
        this.api = params.api;
        this.api.setRowData(this.generateAggKeyFigs(this.props.baselineVolumePlans));
        this.replaceAggRowData(); // IMPORTANT: need to call this after calling setRowData() to replace empty agg row with child row's data
        this.api.setGroupHeaderHeight(0); // hide header columns
    };

    replaceAggRowData = () => {
        // set row group node bvp reference to bvp reference
        debugger;
        this.baselineRowIds.forEach((rowId) => {
            const rowNode = this.api.getRowNode(rowId);
            const rowGroupNode = rowNode.parent;
            rowGroupNode.setData(rowNode.data);
            // rowGroupNode.setAggData(rowNode.data);
            rowNode.setRowHeight(0);
        });
        this.api.refreshClientSideRowModel('sort');
    };

    getAllRows = () => {
        let rowData = [];
        this.api.forEachNode(node => rowData.push([node.id, node]));
        return rowData;
    };

    /**
     * Generates the higher level key figure rows (i.e. ppg and sales uom) based on the bvp sku data for the customer
     * @param bvps
     * @returns {*}
     */
    generateAggKeyFigs = (bvps) => {
        this.api.showLoadingOverlay();
        const newBvps = []; // parent kfgs array
        const completed = {}; // generated parent kfgs hashmap
        const rowGroupCols = this.columnApi.getRowGroupColumns(); // hierarchy levels
        const startYear = this.props.startDate.year();
        const endYear = this.props.endDate.year();
        const nullFields = {};
        const avgMapCount = {}; // Maps the count of the skus to the higher level ids, used to get avg

        this.state.columnGroups.forEach((obj) => {
            const field = this.columnApi.getColumn(obj.id).getColDef().field;
            if (!obj.checked) {
                nullFields[field] = null;
            }
        });
        this.baselineRowIds = []; // IMPORTANT: need to always clear this

        bvps.forEach(bvp => {
                let currBvp = bvp;

                for (let i = rowGroupCols.length - 1; i > 0; i--) { // loop through hierarchy levels besides root
                    const currentField = rowGroupCols[i].getColDef().field; // bvp field name

                    let parentFieldId = '';
                    for (let j = 0; j < i; j++) { // get parent hierarchy for parent row id
                        const field = rowGroupCols[j].getColDef().field;
                        parentFieldId += bvp[field] + '-';
                    }
                    parentFieldId += bvp['key_figure'];

                    if (!completed.hasOwnProperty(parentFieldId)) { // parent kfg not created yet
                        const bvpCopy = {...currBvp, ...nullFields, [currentField]: null}; // create copy of leaf bvp to use as parent
                        for (let k = startYear; k <= endYear; k++) { // deep copy nested jsons for each bvp year
                            bvpCopy[k] = {...bvpCopy[k], id: null}
                        }
                        newBvps.push(bvpCopy); // store reference in array
                        completed[parentFieldId] = bvpCopy; // store same reference in hashmap for quick updating
                        currBvp = bvpCopy;
                        avgMapCount[parentFieldId] = 1;
                    } else { // parent kfg exists
                        this.timeFields.forEach(timeField => { // aggregate current leaf kfg to existing parent kfg
                            completed[parentFieldId][timeField.year][timeField.field] += bvp[timeField.year][timeField.field];
                        });
                        avgMapCount[parentFieldId] += 1;
                    }
                }

            }
        );

        // Goes through the completed (parent) data, looks at the planning config type of the kfg in order to divide by the count to get the average
        for (const [key, data] of Object.entries(completed)) {
            const kfg = data['key_figure'];
            const kfgConfig = this.props.planningConfig.BVP[this.keyFigures[kfg]];
            const verticalAggRule = kfgConfig.vertical_agg;

            switch (verticalAggRule) {
                case rule.AVG: //
                    this.timeFields.forEach(timeField => { // aggregate current leaf kfg to existing parent kfg
                        const summedValue = data[timeField.year][timeField.field];
                        data[timeField.year][timeField.field] = currency(summedValue).divide(avgMapCount[key]).value;
                    });
                    break;
                default:
                    break;
            }
        }

        this.api.hideOverlay();
        return bvps.concat(newBvps); // return new array with added parent kfg entries
    };

    generateColumnDefs = (startDate, endDate) => {
        // calculate current week/month/quarter to set editability
        this.timeFields = [];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const columnDefs = [
            {
                headerName: 'UoM',
                field: 'sales_uom',
                colId: 'sales_uom',
                sort: "desc",
                valueGetter: function (params) {
                    if (params.node) {
                        if (!params.node.group) {
                            let sales_uom = params.node.data.sales_uom;
                            sales_uom = (sales_uom) ? sales_uom : ''; // make empty string if null
                            return `${sales_uom}`;
                        }
                    }
                    return '';
                },
                hide: true,
                enableRowGroup: true,
                rowGroup: true,
            },
            {
                headerName: 'PPG',
                field: 'ppg',
                colId: 'ppg',
                // valueGetter: function (params) {
                //     if (params.node) {
                //         if(!params.node.group) {
                //             let ppg = params.node.data.ppg;
                //             ppg = (ppg) ? ppg : ''; // make empty string if null
                //             return `${ppg}`;
                //         }
                //     }
                //     return '';
                // },
                // sort: 'none',
                // comparator: function (valueA, valueB) {
                //     if (valueA && valueB) {
                //         return valueA.localeCompare(valueB);
                //     } else if (valueA) {
                //         return 1;
                //     } else if (valueB) {
                //         return -1;
                //     }
                //     return 0;
                //     // return null;
                //
                // }.bind(this),
                valueFormatter: function (params) {
                    let ppg = params.value || '';
                    let desc = params.node.allLeafChildren[0].data.ppg_desc;
                    desc = (desc) ? desc : ''; // make empty string if null
                    return `${ppg} - ${desc}`;
                },
                sort: "desc",
                hide: true,
                enableRowGroup: true,
                rowGroup: true,
            },
            {
                headerName: 'SKU',
                field: 'material_number',
                colId: 'material_number',
                valueFormatter: function (params) {
                    let sku = (params.value) ? params.value.replace(/^0+/, '') : '';
                    let desc = params.node.allLeafChildren[0].data.description;
                    desc = (desc) ? desc : ''; // make empty string if null
                    return `${sku} - ${desc}`;
                },
                sort: "asc",
                hide: true,
                enableRowGroup: true,
                filter: true,
                rowGroup: true
            },
            {
                headerName: 'Product Number',
                colId: 'key_figure',
                field: 'key_figure',
                sort: 'none',
                comparator: function (valueA, valueB) {
                    if (valueA && valueB) {
                        return this.props.planningConfig.BVP[this.keyFigures[valueB]].display_order - this.props.planningConfig.BVP[this.keyFigures[valueA]].display_order;
                        // }
                    } else if (valueA) {
                        return -1;
                    } else if (valueB) {
                        return 1;
                    }
                    return 0;
                    // return null;

                }.bind(this),
                pinned: true,
                resizable: true,
                enableRowGroup: false,
                filter: true, //'keyFigureFilter',
                // filterParams: function (params) {
                //     debugger;
                // },
                menuTabs: ['filterMenuTab'],
                // icons: {menu: '<i class="material-icons">filter_list</i>'}
            },
            {
                headerName: 'Non Promoted Retail Price',
                colId: 'key_figure',
                field: 'key_figure',
                sort: 'none',
                comparator: function (valueA, valueB) {
                    if (valueA && valueB) {
                        return this.props.planningConfig.BVP[this.keyFigures[valueB]].display_order - this.props.planningConfig.BVP[this.keyFigures[valueA]].display_order;
                        // }
                    } else if (valueA) {
                        return -1;
                    } else if (valueB) {
                        return 1;
                    }
                    return 0;
                    // return null;

                }.bind(this),
                pinned: true,
                resizable: true,
                enableRowGroup: false,
                filter: true, //'keyFigureFilter',
                // filterParams: function (params) {
                //     debugger;
                // },
                menuTabs: ['filterMenuTab'],
                // icons: {menu: '<i class="material-icons">filter_list</i>'}
            },
            {
                headerName: 'Future Non-Promo Retail Price',
                colId: 'key_figure',
                field: 'key_figure',
                sort: 'none',
                comparator: function (valueA, valueB) {
                    if (valueA && valueB) {
                        return this.props.planningConfig.BVP[this.keyFigures[valueB]].display_order - this.props.planningConfig.BVP[this.keyFigures[valueA]].display_order;
                        // }
                    } else if (valueA) {
                        return -1;
                    } else if (valueB) {
                        return 1;
                    }
                    return 0;
                    // return null;

                }.bind(this),
                pinned: true,
                resizable: true,
                enableRowGroup: false,
                filter: true, //'keyFigureFilter',
                // filterParams: function (params) {
                //     debugger;
                // },
                menuTabs: ['filterMenuTab'],
                // icons: {menu: '<i class="material-icons">filter_list</i>'}
            },
            {
                headerName: 'Future Price',
                colId: 'key_figure',
                field: 'key_figure',
                sort: 'none',
                comparator: function (valueA, valueB) {
                    if (valueA && valueB) {
                        return this.props.planningConfig.BVP[this.keyFigures[valueB]].display_order - this.props.planningConfig.BVP[this.keyFigures[valueA]].display_order;
                        // }
                    } else if (valueA) {
                        return -1;
                    } else if (valueB) {
                        return 1;
                    }
                    return 0;
                    // return null;

                }.bind(this),
                pinned: true,
                resizable: true,
                enableRowGroup: false,
                filter: true, //'keyFigureFilter',
                // filterParams: function (params) {
                //     debugger;
                // },
                menuTabs: ['filterMenuTab'],
                // icons: {menu: '<i class="material-icons">filter_list</i>'}
            },
            {
                headerName: 'Validity Dates',
                colId: 'key_figure',
                field: 'key_figure',
                sort: 'none',
                comparator: function (valueA, valueB) {
                    if (valueA && valueB) {
                        return this.props.planningConfig.BVP[this.keyFigures[valueB]].display_order - this.props.planningConfig.BVP[this.keyFigures[valueA]].display_order;
                        // }
                    } else if (valueA) {
                        return -1;
                    } else if (valueB) {
                        return 1;
                    }
                    return 0;
                    // return null;

                }.bind(this),
                pinned: true,
                resizable: true,
                enableRowGroup: false,
                filter: true, //'keyFigureFilter',
                // filterParams: function (params) {
                //     debugger;
                // },
                menuTabs: ['filterMenuTab'],
                // icons: {menu: '<i class="material-icons">filter_list</i>'}
            }
        ];


        return columnDefs;
    };

    setEditableWrapper = (isFuture) => (params) => {
        const kfg = params.data['key_figure'];
        return (isFuture && this.props.planningConfig.BVP[this.keyFigures[kfg]].is_editable);
    };

    onGridCellChange = (params) => {
        this.api.showLoadingOverlay();

        let node = params.node; // row node
        if (node.group) {
            const childNodeId = this.getHierarchyString(node, node.data['key_figure'], 1);
            node = this.api.getRowNode(childNodeId);
        }

        const jsonProps = params.column.getColDef().jsonProps;

        // user entered empty string, assume 0
        if (isNaN(params.newValue)) {
            node.data[jsonProps.year][jsonProps.field] = 0;
            params.newValue = 0;
        } else { // set changed cell back to original value, will get aggregated back to later
            node.data[jsonProps.year][jsonProps.field] = params.oldValue;
        }

        const kfg = node.data['key_figure'];
        const kfgConfig = this.props.planningConfig.BVP[this.keyFigures[kfg]];
        this.horizontalDisaggRule = kfgConfig.horizontal_disagg;
        this.verticalDisaggRule = kfgConfig.vertical_disagg;
        this.horizontalAggRule = kfgConfig.horizontal_agg;
        this.verticalAggRule = kfgConfig.vertical_agg;

        const oldValue = params.oldValue;
        const newValue = params.newValue;
        const column = params.column;
        const timeDim = { // where change was made (week/month/quarter)
            WEEK: 'w',
            MONTH: 'm',
            QUARTER: 'q'
        };

        // derive time dimension of edit
        let timeDimension;
        if (params.colDef.field.match(/m\d{2}w\d{2}$/g)) {
            timeDimension = timeDim.WEEK;
        } else if (params.colDef.field.match(/m\d{2}$/g)) {
            timeDimension = timeDim.MONTH;
        } else if (params.colDef.field.match(/q\d$/g)) {
            timeDimension = timeDim.QUARTER;
        }

        switch (timeDimension) {
            case timeDim.WEEK:
                this.disaggregateVerticallyToSku(node, column, newValue, oldValue);
                break;
            case timeDim.MONTH:
                this.disaggregateMonth(node, column, newValue, oldValue);
                break;
            case timeDim.QUARTER:
                this.disaggregateQuarter(node, column, newValue, oldValue);
                break;
            default: // could not derive time dimension, error
                this.api.hideOverlay();
                throw new Error('Error: could not derive time dimension of edited cell');
        }
        //this.trackChange(node, jsonProps.year, jsonProps.field, newValue, oldValue);
        params.api.refreshCells(); // refresh cells to reflect changed json data
        this.api.hideOverlay();
    };

    trackChange = (node, year, field, newVal, oldVal) => {
        let changeObj;
        const idList = [{id: node.data[year].id, newValue: newVal, oldValue: oldVal}];

        //track the sku level changes for all key figures (baseline, total, uplift)
        idList.forEach(({id, newValue, oldValue}) => {
            if ((id !== null) && (oldValue !== newValue)) { // check if value was changed and change was at sku level

                if (!this.state.changePending)
                    this.setState({changePending: true});

                if (this.changedEntries.hasOwnProperty(id)) {
                    changeObj = this.changedEntries[id];
                } else {
                    changeObj = {};
                    this.changedEntries[id] = changeObj;
                }
                changeObj[field] = newValue;
            }
        });
    };

    /**
     * Checks what type of horizontal disagg it is in the planning config and calls that function
     * @param node
     * @param column
     * @param monthNewValue
     * @param monthOldValue
     */
    disaggregateMonth = (node, column, monthNewValue, monthOldValue) => {
        switch (this.horizontalDisaggRule) {
            case rule.SUM:
                this.sumDisaggregateMonth(node, column, monthNewValue, monthOldValue);
                break;
            case rule.AVG:
                //TODO is this even a possible type?
                break;
            case rule.CONST:
                this.constDisaggregateMonth(node, column, monthNewValue, monthOldValue);
                break;
            default:
                throw new Error('Horizontal Disaggregation rule missing in config');
        }
    };

    constDisaggregateMonth = (node, column, monthNewValue, monthOldValue) => {
        const monthCol = column.parent;
        const allChildCols = monthCol.children.map(c => c.hasOwnProperty('children') ? c.getLeafColumns()[0] : c); // get all immediate child columns of group column (e.g quarter total, month1, month2, month3)
        const monthProps = allChildCols[0].getColDef().jsonProps;
        const childCols = allChildCols.slice(1); // child columns only without parent total column
        const jsonData = node.data[monthProps.year]; // row data

        const weekCalcVars = this.getWeekCalculationVariables(node, monthCol);
        const totalPastWeeks = this.getMonthPastWeeksTotal(node, childCols, weekCalcVars.validWeekStartIdx);

        let validTotal = monthNewValue - totalPastWeeks;
        if (validTotal < 0) {
            jsonData[monthProps.field] = monthOldValue;
            this.snackbar.error('Value needs to be at least ' + totalPastWeeks);
            return;
        }
        this.disaggregateVerticallyToSku(node, column, monthNewValue, monthOldValue, this.constDisaggregateHorizontalMonth);
    };

    constDisaggregateHorizontalMonth = (node, column, monthValNew, monthValOld) => {
        const monthCol = column.parent;
        const allChildCols = monthCol.children.map(c => c.hasOwnProperty('children') ? c.getLeafColumns()[0] : c); // get all immediate child columns of group column (e.g quarter total, month1, month2, month3)
        const monthProps = allChildCols[0].getColDef().jsonProps;
        const childCols = allChildCols.slice(1); // child columns only without parent total column
        const jsonData = node.data[monthProps.year]; // row data
        const keyFigure = node.data['key_figure'];

        const weekCalcVars = this.getWeekCalculationVariables(node, monthCol);

        for (let i = weekCalcVars.validWeekStartIdx; i < childCols.length; i++) {
            const childProps = childCols[i].getColDef().jsonProps; // jsonfield key (ex m1w1)
            this.calculateBUT(node, column, childProps, keyFigure, monthValNew, monthValOld);
            jsonData[childProps.field] = monthValNew;
            this.trackChange(node, childProps.year, childProps.field, monthValNew, monthValOld);

            this.updateParentNodesAndUpdateLeft(node, column, monthValNew, childProps); //TODO vertical agg, what value should be sent in?
        }

        return true;
    };

    sumDisaggregateMonth = (node, column, monthNewValue, monthOldValue) => {
        const monthCol = column.parent;
        const allChildCols = monthCol.children.map(c => c.hasOwnProperty('children') ? c.getLeafColumns()[0] : c); // get all immediate child columns of group column (e.g quarter total, month1, month2, month3)
        const monthProps = allChildCols[0].getColDef().jsonProps;
        const childCols = allChildCols.slice(1); // child columns only without parent total column
        const jsonData = node.data[monthProps.year]; // row data

        const weekCalcVars = this.getWeekCalculationVariables(node, monthCol);
        const totalPastWeeks = this.getMonthPastWeeksTotal(node, childCols, weekCalcVars.validWeekStartIdx);

        let validTotal = monthNewValue - totalPastWeeks;
        if (validTotal < 0) {
            jsonData[monthProps.field] = monthOldValue;
            this.snackbar.error('Value needs to be at least ' + totalPastWeeks);
            return;
        }
        this.disaggregateVerticallyToSku(node, column, monthNewValue, monthOldValue, this.sumDisaggregateHorizontalMonth);
    };

    sumDisaggregateHorizontalMonth = (node, column, monthValNew, monthValOld) => {
        const monthCol = column.parent;
        const allChildCols = monthCol.children.map(c => c.hasOwnProperty('children') ? c.getLeafColumns()[0] : c); // get all immediate child columns of group column (e.g quarter total, month1, month2, month3)
        const monthProps = allChildCols[0].getColDef().jsonProps;
        const childCols = allChildCols.slice(1); // child columns only without parent total column
        const jsonData = node.data[monthProps.year]; // row data
        const keyFigure = node.data['key_figure'];

        const weekCalcVars = this.getWeekCalculationVariables(node, monthCol);
        const totalPastWeeks = this.getMonthPastWeeksTotal(node, childCols, weekCalcVars.validWeekStartIdx);

        let validTotal = monthValNew - totalPastWeeks;
        let validTotalOld = monthValOld - totalPastWeeks;

        // default spread if no existing distribution
        if (validTotalOld === 0) {
            const dayVal = Math.floor(validTotal / weekCalcVars.daysRemainingInMonth); // calculated value per day
            const dayRem = validTotal % weekCalcVars.daysRemainingInMonth; // remainder on day value
            const weekBase = Math.floor(dayRem / weekCalcVars.weeks); // day remainder split between all weeks in month
            const weekBaseRem = dayRem % weekCalcVars.weeks; // week base remainder

            for (let i = weekCalcVars.validWeekStartIdx; i < childCols.length; i++) {
                let numDays = 7;
                const childProps = childCols[i].getColDef().jsonProps; // jsonfield key (ex m1w1)
                const currWeekBase = (i < weekBaseRem + weekCalcVars.validWeekStartIdx) ? weekBase + 1 : weekBase; // add week base remainder padded to beginning weeks
                const weekOldValue = jsonData[childProps.field];

                // calculate split week values
                if (i === weekCalcVars.validWeekStartIdx) { // start week
                    const numDaysInYearUntilStartDayOfMonth = weekCalcVars.startDay + weekCalcVars.dayOffset - 1; //Note: weekCalcVars.startDay is current day when it's current month and year
                    const numDaysInWeekUntilStartDayOfMonth = numDaysInYearUntilStartDayOfMonth % 7;
                    const numDaysRemainingInStartWeekOfMonth = 7 - numDaysInWeekUntilStartDayOfMonth;

                    numDays = (weekCalcVars.daysRemainingInMonth <= numDaysRemainingInStartWeekOfMonth) ? weekCalcVars.daysRemainingInMonth : numDaysRemainingInStartWeekOfMonth; // days in start week
                } else if (i === childCols.length - 1) { // end week
                    const numDaysInYearUntilEndDayOfMonth = weekCalcVars.endDay + weekCalcVars.dayOffset;
                    const numDaysInWeekUntilEndDayOfMonth = numDaysInYearUntilEndDayOfMonth % 7;
                    numDays = weekCalcVars.daysRemainingInMonth < numDaysInWeekUntilEndDayOfMonth ? weekCalcVars.daysRemainingInMonth : numDaysInWeekUntilEndDayOfMonth; // days in end week
                }
                numDays = (numDays === 0) ? 7 : numDays;

                const weekNewValue = currWeekBase + (dayVal * numDays);
                this.calculateBUT(node, column, childProps, keyFigure, weekNewValue, weekOldValue);
                jsonData[childProps.field] = weekNewValue;
                this.trackChange(node, childProps.year, childProps.field, weekNewValue, weekOldValue);

                const finalDiffValue = weekNewValue - weekOldValue;
                this.updateParentNodesAndUpdateLeft(node, column, finalDiffValue, childProps);
            }
        }
        // copy existing distribution
        else {
            let totalRem = 0;
            for (let i = weekCalcVars.validWeekStartIdx; i < childCols.length; i++) {
                const childProps = childCols[i].getColDef().jsonProps; // jsonfield key (ex m1w1)
                const weekOldValue = jsonData[childProps.field];
                const distVal = (weekOldValue * validTotal) / validTotalOld;
                const childBase = Math.floor(distVal);
                totalRem += distVal - childBase; // TODO: distribute this remainder evenly
                const weekNewValue = (i === childCols.length - 1) ? childBase + Math.round(totalRem) : childBase;

                this.calculateBUT(node, column, childProps, keyFigure, weekNewValue, weekOldValue);
                jsonData[childProps.field] = weekNewValue;
                this.trackChange(node, childProps.year, childProps.field, weekNewValue, weekOldValue);

                const finalDiffValue = weekNewValue - weekOldValue;
                this.updateParentNodesAndUpdateLeft(node, column, finalDiffValue, childProps);
            }
        }
        return true;
    };

    /**
     * Checks what type of horizontal disagg it is in the planning config and calls that function
     * @param node
     * @param column
     * @param quarterValNew
     * @param quarterValOld
     */
    disaggregateQuarter = (node, column, quarterValNew, quarterValOld) => {

        switch (this.horizontalDisaggRule) {
            case rule.SUM:
                this.sumDisaggregateQuarter(node, column, quarterValNew, quarterValOld);
                break;
            case rule.AVG:
                //TODO is this even a possible type?
                break;
            case rule.CONST:
                this.constDisaggregateQuarter(node, column, quarterValNew, quarterValOld);
                break;
            default:
                throw new Error('Horizontal Disaggregation rule missing in config');
        }

    };

    constDisaggregateQuarter = (node, column, quarterValNew, quarterValOld) => {
        const childCols = column.parent.parent.children.slice(1).map(c => c.getLeafColumns()[0]);
        const quarterProps = column.getColDef().jsonProps;
        const jsonData = node.data[quarterProps.year]; // row data

        const startMonth = childCols[0].getColDef().jsonProps.month;
        const endMonth = startMonth + 2;
        const monthDiff = (quarterProps.year === this.currentYear) ? (endMonth - this.currentMonth) + 1 : 3; //TODO if you show a past year, need to make sure you can't edit those months
        const validMonthStartIdx = (monthDiff < 3) ? 3 - monthDiff : 0;
        const invalidMonthEndIdx = (quarterProps.year === this.currentYear && this.currentMonth >= startMonth && this.currentMonth <= endMonth) ? (this.currentMonth - startMonth) + 1 : 0;

        // get past months and weeks in current quarter
        const totalPast = this.getQuarterPastTotal(invalidMonthEndIdx, childCols, jsonData, node);

        // check if new value is high enough to encompass existing past value
        const validTotalNew = quarterValNew - totalPast;
        if (validTotalNew < 0) {
            jsonData[quarterProps.field] = quarterValOld;
            this.snackbar.error('Value needs to be at least ' + totalPast);
            return;
        }

        const constDisaggregateHorizontalQuarter = (skuNode, column, skuNewQuarterValue, skuOldQuarterValue) => {

            for (let i = validMonthStartIdx; i < childCols.length; i++) {
                this.constDisaggregateHorizontalMonth(skuNode, childCols[i], skuNewQuarterValue, skuOldQuarterValue)
            }
        };

        this.disaggregateVerticallyToSku(node, column, quarterValNew, quarterValOld, constDisaggregateHorizontalQuarter);
    };

    sumDisaggregateQuarter = (node, column, quarterValNew, quarterValOld) => {
        const childCols = column.parent.parent.children.slice(1).map(c => c.getLeafColumns()[0]);
        const quarterProps = column.getColDef().jsonProps;
        const jsonData = node.data[quarterProps.year]; // row data

        const startMonth = childCols[0].getColDef().jsonProps.month;
        const endMonth = startMonth + 2;
        const monthDiff = (quarterProps.year === this.currentYear) ? (endMonth - this.currentMonth) + 1 : 3; //TODO if you show a past year, need to make sure you can't edit those months
        const validMonthStartIdx = (monthDiff < 3) ? 3 - monthDiff : 0;
        const invalidMonthEndIdx = (quarterProps.year === this.currentYear && this.currentMonth >= startMonth && this.currentMonth <= endMonth) ? (this.currentMonth - startMonth) + 1 : 0;

        // get past months and weeks in current quarter
        const totalPast = this.getQuarterPastTotal(invalidMonthEndIdx, childCols, jsonData, node);

        // check if new value is high enough to encompass existing past value
        const validTotalNew = quarterValNew - totalPast;
        if (validTotalNew < 0) {
            jsonData[quarterProps.field] = quarterValOld;
            this.snackbar.error('Value needs to be at least ' + totalPast);
            return;
        }

        const totalValidDays = this.getQuarterValidDays(quarterProps.quarter, quarterProps.year);

        const sumDisaggregateHorizontalQuarter = (skuNode, column, skuNewQuarterValue, skuOldQuarterValue) => {
            const skuData = skuNode.data[quarterProps.year];

            const skuQuarterTotalPast = this.getQuarterPastTotal(invalidMonthEndIdx, childCols, skuData, skuNode);
            const skuValidQuarterTotalNew = skuNewQuarterValue - skuQuarterTotalPast;
            const skuValidQuarterTotalOld = skuOldQuarterValue - skuQuarterTotalPast;

            const dayVal = Math.floor(skuValidQuarterTotalNew / totalValidDays);
            let dayValRem = skuValidQuarterTotalNew % totalValidDays;

            // default spread if no existing distribution
            if (skuValidQuarterTotalOld === 0) {
                for (let i = validMonthStartIdx; i < childCols.length; i++) {
                    const childProps = childCols[i].getColDef().jsonProps;
                    const monthRemainingDays = this.getMonthValidDays(childProps.month, childProps.year);
                    const monthBase = dayVal * monthRemainingDays;
                    const weekCalcVars = this.getWeekCalculationVariables(skuNode, childCols[i].getParent());
                    const monthTotalPastWeeks = this.getMonthPastWeeksTotal(skuNode, weekCalcVars.weekCols, weekCalcVars.validWeekStartIdx);

                    const currMonthPast = (childProps.month === this.currentMonth && childProps.year === this.currentYear) ? monthTotalPastWeeks : 0;
                    let finalDayValRem = 0;
                    if (dayValRem > 0) {
                        finalDayValRem = (dayValRem > monthRemainingDays) ? monthRemainingDays : dayValRem;
                        dayValRem -= monthRemainingDays;
                    }
                    const newMonthValue = currMonthPast + monthBase + finalDayValRem;
                    const oldMonthValue = skuData[childProps.field];

                    this.sumDisaggregateHorizontalMonth(skuNode, childCols[i], newMonthValue, oldMonthValue)
                }
            }
            // copy existing distribution
            else {
                let totalRem = 0;
                for (let i = validMonthStartIdx; i < childCols.length; i++) {
                    const childProps = childCols[i].getColDef().jsonProps;
                    const oldMonthValue = skuData[childProps.field];
                    const weekCalcVars = this.getWeekCalculationVariables(skuNode, childCols[i].getParent());
                    const monthTotalPastWeeks = this.getMonthPastWeeksTotal(skuNode, weekCalcVars.weekCols, weekCalcVars.validWeekStartIdx);
                    const distVal = (((oldMonthValue - monthTotalPastWeeks) * skuValidQuarterTotalNew) / skuValidQuarterTotalOld) + monthTotalPastWeeks;

                    const monthBase = Math.floor(distVal);
                    totalRem += distVal - monthBase;
                    const newMonthValue = (i === childCols.length - 1) ? monthBase + Math.round(totalRem) : monthBase;
                    this.sumDisaggregateHorizontalMonth(skuNode, childCols[i], newMonthValue, oldMonthValue);
                }
            }
        };

        this.disaggregateVerticallyToSku(node, column, quarterValNew, quarterValOld, sumDisaggregateHorizontalQuarter);
    };

    /**
     * Disaggregate vertically based on the disagg rule specified in the planning config
     * @param node
     * @param column
     * @param newValue
     * @param oldValue
     * @param horizontalCallback
     */
    disaggregateVerticallyToSku = (node, column, newValue, oldValue, horizontalCallback = null) => {
        //todo
        //check what type of vertical disagg it is in the planning config and call that function

        switch (this.verticalDisaggRule) {
            case rule.SUM:
                this.sumDisaggregateVerticallyToSku(node, column, newValue, oldValue, horizontalCallback);
                break;
            case rule.AVG:
                //TODO is this even a possible type?
                break;
            case rule.CONST:
                this.constDisaggregateVerticallyToSku(node, column, newValue, oldValue, horizontalCallback);
                break;
            default:
                throw new Error('Vertical Disaggregation rule missing in config');
        }

    };

    constDisaggregateVerticallyToSku = (node, column, newValue, oldValue, horizontalCallback = null) => {
        const childCols = column.parent.parent.children.slice(1).map(c => c.getLeafColumns()[0]);
        const jsonProps = column.getColDef().jsonProps;
        const rowGroups = this.columnApi.getRowGroupColumns(); // 3 groups now with uom, ppg and sku
        const kfgValue = node.data['key_figure'];

        const startMonth = childCols[0].getColDef().jsonProps.month;
        const endMonth = startMonth + 2;
        const isReduceAndCurrentTimeDim = (newValue < oldValue && (jsonProps.year === this.currentYear && this.currentMonth >= startMonth && this.currentMonth <= endMonth));

        // sku level
        if (node.level === rowGroups.length) {
            if (horizontalCallback) {
                horizontalCallback(node, column, newValue, oldValue);
            } else { // week level
                this.calculateBUT(node, column, jsonProps, kfgValue, newValue, oldValue);
                node.data[jsonProps.year][jsonProps.field] = newValue;
                this.trackChange(node, jsonProps.year, jsonProps.field, newValue, oldValue);
            }
            this.updateParentNodesAndUpdateLeft(node, column, newValue, jsonProps); //TODO vertical agg, what value should be sent in?
        } else { // higher vertical level
            if (isReduceAndCurrentTimeDim) { // lower value input during current month/quarter, proportions will be skewed
                this.snackbar.warning('Proportions may have been affected');
            }

            const parentNode = node.parent;
            const skuGroupArray = this.getLeafGroups(parentNode);

            for (let i = 0; i < skuGroupArray.length; i++) {
                const childNodeId = this.getHierarchyString(skuGroupArray[i], kfgValue, 1);
                const childNode = this.api.getRowNode(childNodeId);

                if (horizontalCallback) { // month/quarter level
                    horizontalCallback(childNode, column, newValue, oldValue);
                } else { // week level
                    this.calculateBUT(childNode, column, jsonProps, kfgValue, newValue, oldValue);
                    childNode.data[jsonProps.year][jsonProps.field] = newValue;
                    this.trackChange(childNode, jsonProps.year, jsonProps.field, newValue, oldValue);
                }

                this.updateParentNodesAndUpdateLeft(childNode, column, newValue, jsonProps); //TODO vertical agg, what value should be sent in?
            }
        }
    };

    /**
     * Distribute higher level node values directly to sku level nodes
     * @param node
     * @param column
     * @param newValue
     * @param oldValue
     * @param horizontalCallback
     */
    sumDisaggregateVerticallyToSku = (node, column, newValue, oldValue, horizontalCallback = null) => {
        const childCols = column.parent.parent.children.slice(1).map(c => c.getLeafColumns()[0]);
        const jsonProps = column.getColDef().jsonProps;
        const rowGroups = this.columnApi.getRowGroupColumns(); // 3 groups now with uom, ppg and sku
        const diffValue = newValue - oldValue;
        const kfgValue = node.data['key_figure'];

        const startMonth = childCols[0].getColDef().jsonProps.month;
        const endMonth = startMonth + 2;
        const invalidMonthEndIdx = (jsonProps.year === this.currentYear && this.currentMonth >= startMonth && this.currentMonth <= endMonth) ? (this.currentMonth - startMonth) + 1 : 0;
        const rootQuarterTotalPast = this.getQuarterPastTotal(invalidMonthEndIdx, childCols, node.data[jsonProps.year], node);
        const validQuarterTotal = newValue - rootQuarterTotalPast;
        const isReduceAndCurrentTimeDim = (newValue < oldValue && (jsonProps.year === this.currentYear && this.currentMonth >= startMonth && this.currentMonth <= endMonth));

        // sku level
        if (node.level === rowGroups.length) {
            if (horizontalCallback) {
                horizontalCallback(node, column, newValue, oldValue);
            } else { // week level
                this.calculateBUT(node, column, jsonProps, kfgValue, newValue, oldValue);
                node.data[jsonProps.year][jsonProps.field] = newValue;
                this.trackChange(node, jsonProps.year, jsonProps.field, newValue, oldValue);
            }
            this.updateParentNodesAndUpdateLeft(node, column, diffValue, jsonProps);
        } else { // higher vertical level
            if (isReduceAndCurrentTimeDim) { // lower value input during current month/quarter, proportions will be skewed
                this.snackbar.warning('Proportions may have been affected');
            }

            const parentNode = node.parent;
            const skuGroupArray = this.getLeafGroups(parentNode);

            const diffValueBase = Math.floor(diffValue / skuGroupArray.length);
            const diffValueRem = diffValue % skuGroupArray.length;

            if (oldValue === 0) { // even distribution to children
                for (let i = 0; i < skuGroupArray.length; i++) {
                    const childNodeId = this.getHierarchyString(skuGroupArray[i], kfgValue, 1);
                    const childNode = this.api.getRowNode(childNodeId);

                    const finalDiffValue = (i < diffValueRem) ? diffValueBase + 1 : diffValueBase;
                    const childOldValue = childNode.data[jsonProps.year][jsonProps.field];
                    const childNewValue = childOldValue + finalDiffValue;

                    if (horizontalCallback) { // month/quarter level
                        horizontalCallback(childNode, column, childNewValue, childOldValue);
                    } else { // week level
                        this.calculateBUT(childNode, column, jsonProps, kfgValue, childNewValue, childOldValue);
                        childNode.data[jsonProps.year][jsonProps.field] = childNewValue;
                        this.trackChange(childNode, jsonProps.year, jsonProps.field, childNewValue, childOldValue);
                    }
                    //this.api.refreshCells({rowNodes: [childNode]});

                    //this.trackChange(childNode, jsonProps.year, jsonProps.field, childNewValue, childOldValue);
                    this.updateParentNodesAndUpdateLeft(childNode, column, finalDiffValue, jsonProps);
                }
            } else { // proportional distribution to existing
                let valueRem = newValue;
                const childNodeInfos = []; // store all child node references and old values

                for (let i = 0; i < skuGroupArray.length; i++) { // initial loop through all children set base value
                    const nodeInfo = {}; // store node reference and old value
                    const childNodeId = this.getHierarchyString(skuGroupArray[i], kfgValue, 1);
                    const childNode = this.api.getRowNode(childNodeId);
                    const childOldValue = childNode.data[jsonProps.year][jsonProps.field];
                    let childNewValue;

                    // calculate distribution, when current time dim is being reduced with existing past values
                    if (isReduceAndCurrentTimeDim) {
                        const skuQuarterTotalPast = this.getQuarterPastTotal(invalidMonthEndIdx, childCols, childNode.data[jsonProps.year], childNode);
                        const distVal = Math.floor((childOldValue * validQuarterTotal) / oldValue);
                        childNewValue = distVal + skuQuarterTotalPast;
                    } else {
                        childNewValue = Math.floor((childOldValue / oldValue) * newValue);
                    }

                    // hashmap for later changes with remainder
                    nodeInfo.new = childNewValue;
                    nodeInfo.old = childOldValue;
                    nodeInfo.ref = childNode;
                    childNodeInfos.push(nodeInfo);
                    valueRem -= childNewValue;
                }

                // loop through children again and distribute remainder
                for (let i = 0; i < childNodeInfos.length; i++) {
                    const childNode = childNodeInfos[i].ref;
                    const childOldValue = childNodeInfos[i].old;
                    let childNewValue = childNodeInfos[i].new;

                    if (i < valueRem) {
                        childNewValue += 1;
                    }

                    const finalDiffValue = childNewValue - childOldValue;
                    if (horizontalCallback) { // quarter/month level
                        horizontalCallback(childNode, column, childNewValue, childOldValue);
                    } else { // week level
                        this.calculateBUT(childNode, column, jsonProps, kfgValue, childNewValue, childOldValue);
                        childNode.data[jsonProps.year][jsonProps.field] = childNewValue;
                        this.trackChange(childNode, jsonProps.year, jsonProps.field, childNewValue, childOldValue);
                    }

                    this.updateParentNodesAndUpdateLeft(childNode, column, finalDiffValue, jsonProps);
                }
            }
        }
    };

    /**
     * For week level columns only, update all parent nodes vertically and update month and quarter horizontally
     * with the type of agg rule specified
     * @param node
     * @param diffValue The difference (newVal - oldVal) that has been calculated at the sku/week level
     * @param jsonProps
     */
    updateParentNodesAndUpdateLeft = (node, column, diffValue, jsonProps) => {
        // horizontal left aggregations for week column node
        if (jsonProps.week) { // only update vertical parents at week level

            //todo
            //check what type of vertical disagg it is in the planning config and call that function
            const kfg = node.data['key_figure'];

            switch (this.horizontalAggRule) {
                case rule.SUM:
                    this.sumAggregateHorizontal(node, diffValue, jsonProps);
                    break;
                case rule.AVG:
                    this.avgAggregateHorizontal(node, column, diffValue, jsonProps);
                    break;
                case rule.CONST:
                    //todo is this even possible for aggregations?
                    this.constAggregateHorizontal(node, column, diffValue, jsonProps);
                    break;
                default:
                    throw new Error('Horizontal Aggregation rule missing in config');
            }

            switch (this.verticalAggRule) {
                case rule.SUM:
                    this.sumAggregateVertical(node, column, diffValue, jsonProps);
                    break;
                case rule.AVG:
                    this.avgAggregateVertical(node, column, diffValue, jsonProps);
                    break;
                case rule.CONST:
                    //todo is this even possible for aggregations?
                    this.constAggregateVertical(node, column, diffValue, jsonProps);
                    break;
                default:
                    throw new Error('Vertical Aggregation rule missing in config');
            }

        }
    };

    /**
     * Sets the month and quarter average
     * @param node
     * @param column
     * @param diffValue
     * @param jsonProps
     */
    avgAggregateHorizontal = (node, column, diffValue, jsonProps) => {
        const {quarterField, monthField} = this.getMonthAndQuarterFields(jsonProps.field);
        const oldQuarterValue = node.data[jsonProps.year][quarterField];
        const oldMonthValue = node.data[jsonProps.year][monthField];

        const avgValues = this.calculateAvgMonthAndQuarter(node, column, monthField);
        node.data[jsonProps.year][monthField] = avgValues.monthAvg;
        node.data[jsonProps.year][quarterField] = avgValues.quarterAvg;

        this.trackChange(node, jsonProps.year, monthField, avgValues.monthAvg, oldMonthValue);
        this.trackChange(node, jsonProps.year, quarterField, avgValues.quarterAvg, oldQuarterValue);
    };

    /**
     * Averages the weeks to get the month avg value and averages the months to get the quarter avg value
     * @param node
     * @param column
     * @param monthField
     * @returns {{quarterAvg: number, monthAvg: number}}
     */
    calculateAvgMonthAndQuarter = (node, column, monthField) => {
        let quarterTotal = 0;
        let monthAvg = 0;
        let quarterAvg = 0;
        const monthCols = column.parent.parent.children.slice(1).map(c => c.getLeafColumns()[0]); //gets all month column  groups
        for (let i = 0; i < monthCols.length; i++) { //will always be 3 months in a quarter
            if (monthCols[i].getColDef().jsonProps.field === monthField) { //find the month that matches and get its week cols
                const weekCols = monthCols[i].parent.children.slice(1);
                let monthTotal = 0;
                for (let i = 0; i < weekCols.length; i++) {
                    const weekProps = weekCols[i].getColDef().jsonProps;
                    monthTotal += node.data[weekProps.year][weekProps.field]; //adds up all the values in each of the weeks in the month
                }

                if (weekCols.length > 0) { //TODO how exactly do they want the average value in the month from the weeks?
                    monthAvg = currency(monthTotal).divide(weekCols.length).value; //the average value of the weeks in the month
                    quarterTotal += monthAvg;
                }

            } else {
                const monthProps = monthCols[i].getColDef().jsonProps;
                quarterTotal += node.data[monthProps.year][monthProps.field];
            }
        }

        if (monthCols.length > 0) {
            quarterAvg = currency(quarterTotal).divide(monthCols.length).value; //the average value of the 3 months
        }

        return {
            monthAvg: monthAvg,
            quarterAvg: quarterAvg,
        };

    };

    avgAggregateVertical = (node, column, diffValue, jsonProps) => {
        if (node.level > 1) { // There are no parents for level 1
            const kfgValue = node.data['key_figure'];
            const parentNodeId = this.getHierarchyString(node, kfgValue, -1);
            const parentNode = this.api.getRowNode(parentNodeId);

            parentNode.data[jsonProps.year][jsonProps.field] = this.calculateAvgChildren(parentNode, jsonProps);

            this.updateParentNodesAndUpdateLeft(parentNode, column, diffValue, jsonProps);
        }
    };

    calculateAvgChildren = (parentNode, jsonProps) => {
        const rowGroups = this.columnApi.getRowGroupColumns();
        const lastGroupLevel = rowGroups.length - 1; // last group level with children is level 2. Level 3 is just the sku rows
        let total = 0;
        const kfgValue = parentNode.data['key_figure'];
        if (parentNode.level <= lastGroupLevel) {
            const skuGroupArray = this.getLeafGroups(parentNode.parent);
            for (let i = 0; i < skuGroupArray.length; i++) {
                const childNodeId = this.getHierarchyString(skuGroupArray[i], kfgValue, 1);
                const childNode = this.api.getRowNode(childNodeId);

                total += childNode.data[jsonProps.year][jsonProps.field];
            }
            if (skuGroupArray.length > 0) {
                return currency(total).divide(skuGroupArray.length).value;
            }
        }
        return 0;

    };

    sumAggregateHorizontal = (node, diffValue, jsonProps) => {
        const {quarterField, monthField} = this.getMonthAndQuarterFields(jsonProps.field);
        const oldQuarterValue = node.data[jsonProps.year][quarterField];
        const oldMonthValue = node.data[jsonProps.year][monthField];
        const newQuarterValue = oldQuarterValue + diffValue;
        const newMonthValue = oldMonthValue + diffValue;
        node.data[jsonProps.year][quarterField] = newQuarterValue;
        node.data[jsonProps.year][monthField] = newMonthValue;

        this.trackChange(node, jsonProps.year, quarterField, newQuarterValue, oldQuarterValue);
        this.trackChange(node, jsonProps.year, monthField, newMonthValue, oldMonthValue);
    };


    sumAggregateVertical = (node, column, diffValue, jsonProps) => {
        if (node.level > 1) { // There are no parents for level 1
            const kfgValue = node.data['key_figure'];
            const parentNodeId = this.getHierarchyString(node, kfgValue, -1);
            const parentNode = this.api.getRowNode(parentNodeId);

            parentNode.data[jsonProps.year][jsonProps.field] += diffValue;

            this.updateParentNodesAndUpdateLeft(parentNode, column, diffValue, jsonProps);
        }
    };

    constAggregateHorizontal = (node, column, diffValue, jsonProps) => {
        const {quarterField, monthField} = this.getMonthAndQuarterFields(jsonProps.field);
        const oldQuarterValue = node.data[jsonProps.year][quarterField];
        const oldMonthValue = node.data[jsonProps.year][monthField];

        node.data[jsonProps.year][quarterField] = diffValue;
        node.data[jsonProps.year][monthField] = diffValue;

        this.trackChange(node, jsonProps.year, quarterField, diffValue, oldQuarterValue);
        this.trackChange(node, jsonProps.year, monthField, diffValue, oldMonthValue);
    };

    constAggregateVertical = (node, column, diffValue, jsonProps) => {
        if (node.level > 1) { // There are no parents for level 1
            const kfgValue = node.data['key_figure'];
            const parentNodeId = this.getHierarchyString(node, kfgValue, -1);
            const parentNode = this.api.getRowNode(parentNodeId);

            parentNode.data[jsonProps.year][jsonProps.field] = diffValue;

            this.updateParentNodesAndUpdateLeft(parentNode, column, diffValue, jsonProps);
        }
    };

    getWeekCalculationVariables = (node, monthCol) => {
        const allChildCols = monthCol.children.map(c => c.hasOwnProperty('children') ? c.getLeafColumns()[0] : c); // get all immediate child columns of group column (e.g quarter total, month1, month2, month3)
        const monthProps = allChildCols[0].getColDef().jsonProps;
        const childCols = allChildCols.slice(1); // child columns only without parent total column

        const custStartDay = this.getStartDay(monthProps.year, this.props.customerStartDay);
        const month = monthProps.month - 1; // month number being edited (starting at 0)
        const dayOffset = new Date(monthProps.year, 0, 0).getDay() + custStartDay; // change day to 1 for sunday start week
        const timestamp = new Date().setFullYear(monthProps.year, 0, 1);
        const yearFirstDay = Math.floor(timestamp / 86400000); // UTC first day of year

        const day = ((this.currentYear === monthProps.year) && (month === this.currentMonth - 1)) ? this.currentDay : 1; // if in the current month day is current day
        const monthStart = Math.ceil((new Date(monthProps.year, month, day).getTime()) / 86400000); // UTC month start (Either first day of month or current day)
        const monthEnd = Math.ceil((new Date(monthProps.year, month + 1, 0).getTime()) / 86400000); // UTC month end

        const startDay = monthStart - yearFirstDay; // start of month day of year (Either first day of month or current day)
        const endDay = monthEnd - yearFirstDay; // end of month day of year
        const daysRemainingInMonth = endDay - startDay + 1; // total days in month

        const weekRange = this.getWeekRange(monthProps.year, month, day); // start and end week of current month
        const weeks = weekRange.end - weekRange.start + 1; // number of weeks inclusive
        const validWeekStartIdx = childCols.length - weeks; // start week of month, columns will always be in order

        return {
            weekCols: childCols,
            month: month,
            day: day,
            endDay: endDay,
            startDay: startDay,
            dayOffset: dayOffset,
            daysRemainingInMonth: daysRemainingInMonth,
            validWeekStartIdx: validWeekStartIdx,
            weeks: weeks,
        }
    };

    getWeekRange = (year, month, day = 1) => {
        const firstDayOfYear = new Date(year, 0, 1);
        const monthStart = new Date(year, month, day);
        const monthEnd = new Date(year, month + 1, 0);
        const pastFromMonthStart = (monthStart - firstDayOfYear) / 86400000;
        const pastFromMonthEnd = (monthEnd - firstDayOfYear) / 86400000;
        const startDay = this.getStartDay(year, this.props.customerStartDay);
        return {
            start: Math.ceil((pastFromMonthStart + firstDayOfYear.getDay() + startDay) / 7), // Add + 1 to start week on Sunday
            end: Math.ceil((pastFromMonthEnd + firstDayOfYear.getDay() + startDay) / 7)
        };
    };

    getStartDay = (year, startDay) => {
        const firstDayofYear = new Date(year, 0, 1).getDay();
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let idx = days.indexOf(startDay);

        if (idx < firstDayofYear) {
            return (0 - idx);
        }
        return (7 - idx);
    };


    /**
     * Get fields for quarter and month of a provided week level field
     * @param weekField
     * @returns {{quarterField: string, monthField: *}}
     */
    getMonthAndQuarterFields = (weekField) => {
        const monthField = weekField.slice(0, -3);
        const month = parseInt(monthField.slice(-2));
        const quarter = Math.floor((month + 2) / 3);
        const year = weekField.slice(0, 5);
        const quarterField = `${year}q${quarter}`;

        return {
            quarterField: quarterField,
            monthField: monthField,
        }
    };

    /**
     * Get the valid days left in the quarter. Valid days include today
     * @param quarter
     * @param year
     * @returns {number}
     */
    getQuarterValidDays = (quarter, year) => {
        let days = 0;
        const startMonth = (quarter * 3) - 2;

        for (let i = startMonth; i < startMonth + 3; i++) {
            days += this.getMonthValidDays(i, year);
        }
        return days;
    };

    /**
     * Get the valid days left in the month. If the month is equal to current month, subtract past days.
     * @param month
     * @param year
     * @returns {number}
     */
    getMonthValidDays = (month, year) => { // month should start at Jan = 1
        let days = new Date(year, month, 0).getDate();
        if (year === this.currentYear) {
            if (month < this.currentMonth) {
                return 0;
            }
            if (month === this.currentMonth) {
                days -= (this.currentDay - 1);
            }
        }
        return days;
    };

    /**
     * Get past months and weeks aggregated value in current quarter
     * @param invalidMonthEndIdx
     * @param childCols
     * @param jsonData Data of the node that is being looked at
     * @param node
     * @returns {number}
     */
    getQuarterPastTotal = (invalidMonthEndIdx, childCols, jsonData, node) => {
        let totalPastMonths = 0;
        let monthTotalPastWeeks = 0;
        for (let i = 0; i < invalidMonthEndIdx; i++) {
            const childProps = childCols[i].getColDef().jsonProps; // jsonfield key (ex m1w1)
            if (childProps.month === this.currentMonth && childProps.year === this.currentYear) { // get total for current month past weeks
                const monthCol = childCols[i].getParent();
                const weekCalcVars = this.getWeekCalculationVariables(node, monthCol);
                monthTotalPastWeeks = this.getMonthPastWeeksTotal(node, weekCalcVars.weekCols, weekCalcVars.validWeekStartIdx);
            } else { // get total for full past months
                totalPastMonths += jsonData[childProps.field];
            }
        }
        return totalPastMonths + monthTotalPastWeeks;
    };

    getMonthPastWeeksTotal = (node, weekCols, validWeekStartIdx) => {
        const jsonData = node.data;

        let totalPastWeeks = 0;
        for (let i = 0; i < validWeekStartIdx; i++) {
            const childProps = weekCols[i].getColDef().jsonProps; // jsonfield key (ex m1w1)
            const existingVal = jsonData[childProps.year][childProps.field];
            totalPastWeeks += existingVal;
        }
        return totalPastWeeks;
    };


    /**
     * Calculate logic Baseline + Uplift = Total, based on which key figure is edited
     * @param node
     * @param jsonProps
     * @param keyFigure
     * @param newValue
     * @param oldValue
     */
    calculateBUT = (node, column, jsonProps, keyFigure, newValue, oldValue) => {
        const diffValue = newValue - oldValue;
        let upliftNodeId, upliftNode, totalNodeId, totalNode, baselineNodeId, baselineNode; // node ids and references
        let upliftOldValue, upliftNewValue, upliftDiffValue, baselineOldValue, baselineNewValue, baselineDiffValue,
            totalOldValue, totalNewValue,
            totalDiffValue; // node values

        switch (keyFigure) {
            case 'Baseline Volume':
                upliftNodeId = this.getHierarchyString(node, 'Uplift Volume', 0);
                upliftNode = this.api.getRowNode(upliftNodeId);
                totalNodeId = this.getHierarchyString(node, 'Total Volume', 0);
                totalNode = this.api.getRowNode(totalNodeId);
                if (!this.isSimplifiedVolumePlanning()) {
                    if (upliftNode.data[jsonProps.year][jsonProps.field] === 0) { // uplift is 0 -> edit total
                        totalOldValue = totalNode.data[jsonProps.year][jsonProps.field];
                        totalNode.data[jsonProps.year][jsonProps.field] = newValue;
                        this.trackChange(totalNode, jsonProps.year, jsonProps.field, newValue, totalOldValue);
                        this.updateParentNodesAndUpdateLeft(totalNode, column, diffValue, jsonProps);
                    } else { // uplift has existing value -> edit uplift
                        upliftOldValue = upliftNode.data[jsonProps.year][jsonProps.field];
                        upliftNewValue = totalNode.data[jsonProps.year][jsonProps.field] - newValue;
                        upliftDiffValue = upliftNewValue - upliftOldValue;
                        upliftNode.data[jsonProps.year][jsonProps.field] = upliftNewValue;
                        this.trackChange(upliftNode, jsonProps.year, jsonProps.field, upliftNewValue, upliftOldValue);
                        this.updateParentNodesAndUpdateLeft(upliftNode, column, upliftDiffValue, jsonProps);
                    }
                } else {
                    totalOldValue = totalNode.data[jsonProps.year][jsonProps.field];
                    totalNewValue = upliftNode.data[jsonProps.year][jsonProps.field] + newValue;
                    totalDiffValue = totalNewValue - totalOldValue;
                    totalNode.data[jsonProps.year][jsonProps.field] = totalNewValue;
                    this.trackChange(totalNode, jsonProps.year, jsonProps.field, totalNewValue, totalOldValue);
                    this.updateParentNodesAndUpdateLeft(totalNode, column, totalDiffValue, jsonProps);
                }
                break;
            case 'Uplift Volume':
                baselineNodeId = this.getHierarchyString(node, 'Baseline Volume', 0);
                baselineNode = this.api.getRowNode(baselineNodeId);
                totalNodeId = this.getHierarchyString(node, 'Total Volume', 0);
                totalNode = this.api.getRowNode(totalNodeId);
                totalOldValue = totalNode.data[jsonProps.year][jsonProps.field];
                totalNewValue = baselineNode.data[jsonProps.year][jsonProps.field] + newValue;
                totalDiffValue = totalNewValue - totalOldValue;
                totalNode.data[jsonProps.year][jsonProps.field] = totalNewValue;
                this.trackChange(totalNode, jsonProps.year, jsonProps.field, totalNewValue, totalOldValue);
                this.updateParentNodesAndUpdateLeft(totalNode, column, totalDiffValue, jsonProps);
                break;
            case 'Total Volume':
                baselineNodeId = this.getHierarchyString(node, 'Baseline Volume', 0);
                baselineNode = this.api.getRowNode(baselineNodeId);
                upliftNodeId = this.getHierarchyString(node, 'Uplift Volume', 0);
                upliftNode = this.api.getRowNode(upliftNodeId);
                upliftOldValue = upliftNode.data[jsonProps.year][jsonProps.field];
                upliftNewValue = newValue - baselineNode.data[jsonProps.year][jsonProps.field];
                upliftDiffValue = upliftNewValue - upliftOldValue;
                upliftNode.data[jsonProps.year][jsonProps.field] = upliftNewValue;
                this.trackChange(upliftNode, jsonProps.year, jsonProps.field, upliftNewValue, upliftOldValue);
                this.updateParentNodesAndUpdateLeft(upliftNode, column, upliftDiffValue, jsonProps);
                break;
            default:
                break;
        }
    };

    isSimplifiedVolumePlanning = () => {
        const canEditBaseline = this.props.planningConfig.BVP['baseline_volume'].is_editable;
        const canEditUplift = this.props.planningConfig.BVP['uplift_volume'].is_editable;
        const canEditTotal = this.props.planningConfig.BVP['total_volume'].is_editable;

        if (canEditBaseline && canEditUplift && canEditTotal) {
            return true;
        }
        return false;
    };

    getLeafGroups = (parentNode, skuGroupArray = []) => {
        const rowGroups = this.columnApi.getRowGroupColumns(); // 3 groups now with uom, ppg and sku
        const lastGroupLevel = rowGroups.length - 1; // last group level with children is level 2. Level 3 is just the sku rows
        for (let childNode of Object.values(parentNode.childrenMapped)) {
            if (childNode.level < lastGroupLevel) {
                this.getLeafGroups(childNode, skuGroupArray);
            }
            if (childNode.level === lastGroupLevel) {
                skuGroupArray.push(childNode);
            }
        }
        return skuGroupArray;
    };


    /**
     * Gets the parent/child hierarchy string for a given node. Gets the complete hierarchy string for json data.
     * @param node : row for getting parent or child, json data for getting current
     * @param kfg : key figure property name
     * @param level : -1 -> parent, 0 -> current, 1 -> child
     * @param isData : boolean, is json data
     * @returns {string}
     */
    getHierarchyString = (node, kfg, level, isData = false) => { // -1 -> parent, 0 -> current, 1 -> child
        let hierStr = '';
        const rowGroupCols = this.columnApi.getRowGroupColumns();

        switch (level) {
            case -1:
                if (isData) throw Error('Can only get parent from row node, not json data');
                if (node.group) throw Error('Can only get parent of non-group row');
                if (node.level < 2) throw Error('This KFG does not have a parent KFG');

                for (let i = 0; i <= node.level - 2; i++) {
                    const field = rowGroupCols[i].getColDef().field;
                    const value = node.data[field];
                    hierStr += (i === 0) ? value : '-' + value;
                }
                break;
            case 0:
                let data;
                if (isData) { // json data provided
                    data = node;
                } else { // node provided
                    data = node.data;
                }
                for (let i = 0; i < rowGroupCols.length; i++) {
                    const field = rowGroupCols[i].getColDef().field;
                    if (data[field]) {
                        hierStr += (i === 0) ? data[field] : '-' + data[field];
                    }
                }
                break;
            case 1:
                if (isData) throw Error('Can only get child from row node, not json data');
                if (!node.group) throw Error('Can only get child of a group row');
                if (node.level >= rowGroupCols.length) throw Error('Cannot get children of lowest level');

                let currNode = node;
                for (let i = node.level; i >= 0; i--) {
                    const value = currNode.key;
                    currNode = currNode.parent;
                    hierStr = (i === node.level) ? value : value + '-' + hierStr;
                }
                break;
            default:
                throw Error('Invalid level parameter');
        }
        hierStr += '-' + kfg;
        return hierStr;
    };

    handleChange = (e, type = '') => {
        this.setState({
            [type]: e
        })
    };


    // onFirstDataRendered = (params) => {
    //     let allGroups = params.columnApi.getAllDisplayedColumnGroups(); // root group columns (quarters)
    //     params.columnApi.autoSizeAllColumns(); // set all column to minimum width
    //     allGroups.forEach(function (group) { // collapse group columns
    //         group.getChildren().forEach((childGroup) => {
    //             params.columnApi.setColumnGroupOpened(childGroup.getGroupId(), false); // collapse month columns
    //         });
    //         params.columnApi.setColumnGroupOpened(group.getGroupId(), false); // collapse quarter columns
    //     });
    // };

    getRowNodeId = (data) => { // runs every time this.api.setRowData is called
        //if (!this.columnApi) return; // TODO: change this temporary fix for switching screens back and forth, should we reinitialize this component?
        const rowId = this.getHierarchyString(data, data['key_figure'], 0, true);
        if (data['key_figure'] === 'Baseline Volume') {
            this.baselineRowIds.push(rowId);
        }
        return rowId;
    };

    onSave = () => {
        this.api.showLoadingOverlay();
        this.props.saveBvpsAction(this.changedEntries).then(
            (changed) => { // resolve
                this.snackbar.success('Changes saved');
                this.api.hideOverlay();
            },
            (err) => { // reject
                this.snackbar.error(`Error saving changes: ${err}`);
                this.api.hideOverlay();
            }
        );
        this.setState({changePending: false});
        this.changedEntries = {};
    };

    onExport() {
        let params = {
            skipHeader: true,
            columnGroups: true,
            skipFooters: true,
            skipGroups: false,
            skipPinnedTop: false,
            skipPinnedBottom: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'baseline_volume',
            sheetName: this.props.selectedCustomer,
        };
        this.api.exportDataAsExcel(params)
    }

    isFirstColumn = (params) => {
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        const thisIsFirstColumn = displayedColumns[0] === params.column;
        return thisIsFirstColumn;
    };

    onSearch = (event) => {
        if (event.type === 'click' || event.keyCode === 13) {
            this.api.setQuickFilter(document.getElementById('bvp_search_input').value);
        }
    };

    onCustomizeTable = (event) => {
        this.setState({customizeTableElement: event.currentTarget});
    };

    onCustomizeTableApply = () => {
        const checkedColIds = [];
        const checkedCols = [];
        const uncheckedCols = [];
        let skuCol = null;
        let headerText = '';
        this.state.columnGroups.forEach(obj => {
            if (obj.id === 'material_number') { // store sku column (should always be checked leaf)
                skuCol = obj;
            } else { // normal columns
                if (obj.checked) {
                    headerText += `${obj.value}/`;
                    checkedColIds.push(obj.id);
                    checkedCols.push(obj);
                } else {
                    uncheckedCols.push(obj);
                }
            }
        });
        // add sku column to end of checked columns arrays
        checkedColIds.push(skuCol.id);
        checkedCols.push(skuCol);
        this.groupHeader = headerText + skuCol.value; // set group header text

        this.columnApi.setRowGroupColumns(checkedColIds);
        this.api.setRowData(this.generateAggKeyFigs(this.props.baselineVolumePlans)); // TODO: figure out how to make this work
        this.replaceAggRowData();
        this.setState({
            columnGroups: checkedCols.concat(uncheckedCols),
            customizeTableElement: null
        });
    };

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newList = [...this.state.columnGroups];
        const [removed] = newList.splice(result.source.index, 1);
        newList.splice(result.destination.index, 0, removed);

        this.setState({columnGroups: newList});
    };

    onCustomizeTableCheck = colGroup => event => {
        const newColGroups = this.state.columnGroups.map((obj, idx) => {
            if (obj.value === colGroup.value) {
                obj.checked = !obj.checked;
            }
            return obj;
        });
        this.setState({columnGroups: newColGroups});
    };

    headerValueGetter = () => {
        return this.groupHeader;
    };

    filterValueGetter = (params) => {
        const data = [];
        switch (this.groupHeader) {
            case "UoM/PPG/SKU":
                data.push(params.data.sales_uom);
                data.push(params.data.ppg);
                data.push(params.data.material_number);
                break;
            case "PPG/SKU":
                data.push(params.data.ppg);
                data.push(params.data.material_number);
                break;
            case "UoM/SKU":
                data.push(params.data.sales_uom);
                data.push(params.data.material_number);
                break;
            default:
                data.push(params.data.material_number);
        }

        return data;
    };

    handleExpandClose = (column, expanded) => {
        return !column.isExpanded(expanded)
    };

    /**
     * Reload BVPs when component is mounted
     */
    componentDidMount = () => {
        this.baselineRowIds = [];
        this.props.getBvpsAction();
    };

    render() {
        // reload BVPs when customer/dates are changed
        if (this.props.bvpLoadPending && !this.props.pendingGet) {
            this.props.getBvpsAction();
        }
        if (this.props.pendingGet) {  // loading data
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress/>
                </div>
            );
        } else if (!this.props.ifChanged) {
            return (
                <div className='ag-theme-material' style={{
                    height: '100%',
                    width: '100%'
                }}>
                    <Grid item xs={12} style={{marginBottom:'10px', height:'40px'}}>
                            <h4 style={{padding:'10px', marginLeft:'10px'}}>Customer Hierarchy Level 2: Customer 1, Customer 2, Customer 3, Customer 4</h4>
                    </Grid>
                    {this.props.selectedCustomer && this.props.startDate && this.props.endDate ?
                        <Fragment>
                            <Fab style={{
                                position: 'fixed',
                                right: '40px',
                                bottom: '30px',
                                borderRadius: '20px',
                                width: '7rem',
                                height: '2rem',
                                zIndex: 10
                            }}
                                 color={'primary'}
                                 disabled={!this.state.changePending}
                                 onClick={this.onSave.bind(this)}>
                                <SaveIcon/>
                                Save
                            </Fab>

                            <Grid container justify={'flex-start'}>
                                <Grid item xs={6}>
                                    <Grid container justify={'flex-start'}>
                                        <Input id={'bvp_search_input'} onKeyUp={this.onSearch} endAdornment={
                                            <InputAdornment position={'end'}>
                                                <IconButton onClick={this.onSearch}>
                                                    <SearchIcon fontSize={'small'} style={{paddingRight: 3}}/>
                                                </IconButton>
                                            </InputAdornment>
                                        }/>
                                        <Button style={{color: 'rgba(61,69,81)'}}>
                                            <Add fontSize={'small'} fontWeight={'500'}/>
                                            <Link to={{pathname: '/promoevent/new', state: {kind: 'POST'}}} style={{color: 'rgba(61,69,81)'}}>
                                                Add
                                            </Link>
                                        </Button>

                                        <Button style={{color: 'rgba(61,69,81)'}}>
                                            <Sync fontSize={'small'} fontWeight={'500'}/>
                                            <Link to={{pathname: '/promoevent/new', state: {kind: 'POST'}}} style={{color: 'rgba(61,69,81)'}}>
                                                Replace
                                            </Link>
                                        </Button>

                                        <Button style={{color: 'rgba(61,69,81)'}}>
                                            <FileCopyOutlinedIcon fontSize={'small'} fontWeight={'500'}/>
                                            <Link to={{pathname: '/promoevent/new', state: {kind: 'POST'}}} style={{color: 'rgba(61,69,81)'}}>
                                                Copy
                                            </Link>
                                        </Button>

                                        <Button size={"small"} style={{color: 'rgba(61,69,81)'}}>
                                            <DeleteOutlinedIcon fontSize={'small'} fontWeight={'500'}/>
                                            <Link to={{pathname: '/promoevent/new', state: {kind: 'POST'}}} style={{color: 'rgba(61,69,81)'}}>
                                                Delete
                                            </Link>
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container justify={'flex-end'}>
                                        <Button onClick={this.onCustomizeTable} style={{fontSize: '.8rem'}}>
                                            <TableChartIcon fontSize={'small'} style={{paddingRight: 3}}/>
                                            Customize Table
                                        </Button>
                                        <CustomizedDialog onClose={() => this.setState({customizeTableElement: null})}
                                                          open={!!this.state.customizeTableElement}
                                                          title={'Customize Table'}
                                                          submitText={'APPLY'}
                                                          onSubmit={this.onCustomizeTableApply}>
                                            <div style={{margin: '2rem', width: '25rem'}}>
                                                <Typography variant={'h6'}>
                                                    Rows
                                                </Typography>
                                                <Paper>
                                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                                        <Droppable droppableId="droppable">
                                                            {(provided, snapshot) => (
                                                                <RootRef rootRef={provided.innerRef}>
                                                                    <List>
                                                                        {this.state.columnGroups.map((kfg, index) => (
                                                                            (kfg.id !== 'material_number') ?
                                                                                <Draggable key={kfg.id}
                                                                                           draggableId={kfg.id}
                                                                                           index={index}
                                                                                           isDragDisabled={!kfg.checked}>
                                                                                    {(provided, snapshot) => (
                                                                                        <ListItem dense
                                                                                                  ContainerComponent="li"
                                                                                                  ref={provided.innerRef}
                                                                                                  {...provided.draggableProps}
                                                                                                  {...provided.dragHandleProps}
                                                                                                  style={{...snapshot.isDragging, ...provided.draggableProps.style}}>
                                                                                            <ListItemIcon>
                                                                                                <Checkbox color='primary'
                                                                                                    onChange={this.onCustomizeTableCheck(kfg)}
                                                                                                    checked={kfg.checked}/>
                                                                                            </ListItemIcon>
                                                                                            <ListItemText
                                                                                                primary={kfg.value}/>
                                                                                            {(kfg.checked) ?
                                                                                                <ListItemIcon>
                                                                                                    <DragIndicatorIcon/>
                                                                                                </ListItemIcon>
                                                                                                : null}
                                                                                        </ListItem>
                                                                                    )}
                                                                                </Draggable> : null
                                                                        ))}
                                                                        {provided.placeholder}
                                                                        <ListItem dense>
                                                                            <ListItemIcon>
                                                                                <Checkbox color='primary'
                                                                                    checked={true}
                                                                                    disabled={true}/>
                                                                            </ListItemIcon>
                                                                            <ListItemText primary={'SKU'}/>
                                                                        </ListItem>
                                                                    </List>
                                                                </RootRef>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                </Paper>
                                            </div>
                                        </CustomizedDialog>
                                        <Button onClick={this.onExport.bind(this)} style={{fontSize: '.8rem'}}>
                                            <LaunchIcon fontSize={'small'} style={{paddingRight: 3}}/>
                                            Export
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <AgGridReact
                                columnDefs={this.generateColumnDefs(this.props.startDate, this.props.endDate)}
                                //rowData={this.generateAggKeyFigs(this.props.baselineVolumePlans)}
                                //deltaRowDataMode={true}
                                expandClose={this.handleExpandClose}
                                suppressHorizontalScroll={false}
                                onGridReady={this.onGridReady}
                                //onFirstDataRendered={this.onFirstDataRendered}
                                onCellValueChanged={this.onGridCellChange}
                                enableGroupEdit={true}
                                //aggregateOnlyChangedColumns={true}
                                //onCellKeyPress={this.onCellKeyPress.bind(this)}
                                suppressMakeColumnVisibleAfterUnGroup={true}
                                //suppressMovableColumns={true}
                                //suppressLoadingOverlay={false}
                                //suppressPropertyNamesCheck={true}
                                //suppressAggFuncInHeader={true}
                                singleClickEdit={true}
                                //enableGroupEdit={true} // need this for aggregation edit
                                rowHeight={25}
                                groupMultiAutoColumn={false}
                                suppressColumnVirtualisation={true}
                                stopEditingWhenGridLosesFocus={true}
                                //suppressAggAtRootLevel={true}
                                //suppressMaintainUnsortedOrder={true}
                                //rowGroupPanelShow={'always'}
                                //onColumnRowGroupChanged={this.onRowGroupChange}
                                getRowNodeId={this.getRowNodeId}
                                headerHeight={45}
                                suppressDragLeaveHidesColumns={false}
                                // onFilterChanged={this.onFilterChanged}
                                //onRowEditingStarted={this.onRowEditingStarted}
                                //onCellEditingStarted={this.onCellKeyPress}
                                //onColumnMoved={this.onColumnMoved.bind(this)}
                                //onDragStopped={this.onDragStopped.bind(this)}
                                overlayLoadingTemplate={this.progressBarHtml}
                                rowSelection={'multiple'}
                                groupSelectsChildren={true}
                                suppressRowClickSelection={true}
                                defaultColDef={{
                                    cellStyle: {lineHeight: '25px'},
                                    //resizable: true,
                                    //sortable: true,
                                    //suppressMenu: false,
                                    //enablePivot: true,
                                    headerCheckboxSelection: this.isFirstColumn,
                                    checkboxSelection: this.isFirstColumn,
                                }}
                                // getRowStyle={(params) => {
                                //     if (params.node.group) {
                                //         this.currentStyle = !this.currentStyle;
                                //     }
                                //     return (this.currentStyle) ? {'background-color': 'lightgray'} : {'background-color': 'white'};
                                //
                                //
                                //     // const rowIdx = parseInt(params.node.getRowIndexString());
                                //     // if (rowIdx === 0) {
                                //     //     return {'background-color': 'white'};
                                //     // }
                                //     //
                                //     // const nodeAbove = params.api.getDisplayedRowAtIndex(rowIdx - 1);
                                //     // const styleAbove = params.api.gridOptionsWrapper.gridOptions.getRowStyle({node: nodeAbove, ...params});
                                //     // let style = null;
                                //     // if (params.node.group) { // group rows
                                //     //     style = (styleAbove['background-color'] === 'white') ? {'background-color': 'lightgray'} : {'background-color': 'white'};
                                //     // } else {
                                //     //     style = (styleAbove['background-color'] === 'white') ? {'background-color': 'white'} : {'background-color': 'lightgray'};
                                //     // }
                                //     // return style;
                                // }}
                                // groupHideOpenParents={true}
                                // groupDefaultExpanded={-1}
                                // columnGroupOpened={this.onColumnGroupOpened}
                                autoGroupColumnDef={{
                                    cellStyle: {textOverflow: 'unset', lineHeight: '25px'},
                                    resizable: true,
                                    pinned: true,
                                    // sortable: true,
                                    headerValueGetter: this.headerValueGetter,
                                    // filter: 'agSetColumnFilter',
                                    sort: 'asc',
                                    // valueFormatter: function (params) {
                                    //     return '';
                                    // },
                                    suppressMenu: true,
                                    // width: 300,
                                    // filterValueGetter: this.filterValueGetter,
                                    menuTabs: ['filterMenuTab'],
                                    icons: {menu: '<i class="material-icons">filter_list</i>'},
                                    // cellRendererParams: {
                                    //     padding: 15,
                                    // }
                                }}
                                frameworkComponents={{
                                    customExpandComponent: CustomHeader,
                                    keyFigureFilter: KeyFigureFilter,
                                }}
                                components={{
                                    numericCellEditor: NumericCellEditor,
                                }}>
                            </AgGridReact>
                            <CustomizedSnackbar ref={el => this.snackbar = el}/>
                        </Fragment>
                        : null}
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        baselineVolumePlans: state.Bvp.baselineVolumePlans,
        changedEntries: state.Bvp.changedEntries,
        pendingGet: state.Bvp.pendingGet,
        pendingSave: state.Bvp.pendingSave,
        startDate: state.Bvp.startDate,
        endDate: state.Bvp.endDate,
        customer: state.Bvp.customer,
        ifChanged: state.Bvp.ifChanged,
        collapsed: state.App.collapsed,
        customerStartDay: state.PlannableCustomers.customerStartDay,
        selectedCustomer: state.PlannableCustomers.selectedCustomer,
        bvpLoadPending: state.Bvp.bvpLoadPending,
        applied: state.Bvp.applyBVPSelections,
        planningConfig: state.PlannableCustomers.planningConfig,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getBvpsAction: () => dispatch(actions.getBvpsAction()),  //TODO MAKE SURE YOU ARE GETTING THE CUSTOMER ID EXTRACTING IT!!!
        saveBvpsAction: (changedEntries) => dispatch(actions.saveBvpsAction(changedEntries)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AssortmentGrid)