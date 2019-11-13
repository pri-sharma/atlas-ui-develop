import React, {Component} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {connect} from 'react-redux';
import StatusCellRenderer from '../components/CellRenderers/StatusCellRenderer';
import LinkCellRenderer from '../components/CellRenderers/LinkCellRenderer';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/DeleteOutlined';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import FileCopy from '@material-ui/icons/FileCopyOutlined';
import SearchIcon from '@material-ui/icons/Search';
import TableChartIcon from '@material-ui/icons/TableChartOutlined';
import CustomFilterHeader from '../components/CustomFilterHeader';
import CustomizedSnackbar from '../components/CustomizedSnackbar';
import * as action from '../redux/events/actions';
import CustomizedDialog from '../components/customizedDialog/CustomizedDialog';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Link} from 'react-router-dom';
import {Styled} from './EventContainerGrid.style';
import CopyIcon from "../images/Copy.png";
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {InputNumber as InputANTD} from 'antd';



const levels = [{value: 'Day(s)'}, {value: 'Week(s)'}, {value: 'Month(s)'}, {value: 'Quarter(s)'},{value: 'Year(s)'}];



class EventContainerGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSelected: false,
            columnDefs: this.props.columnDefs,
            rowData: this.props.data,
            frameworkComponents: {
                statusCellRenderer: StatusCellRenderer,
                linkCellRenderer: LinkCellRenderer,
                customFilterHeader: CustomFilterHeader
            },
            isCustomizeOpen: false,
            customizedColumns: null,
            increment: '0',
            level: 'Day(s)',
            copies: '0'
        };
        this.api = null;
        this.columnApi = null;

    }

    handleDelete = () => {
        this.selectedRows = this.api.getSelectedRows();
        for (let i = 0; i < this.selectedRows.length; i++) {
            if (this.selectedRows[i].status === 'Draft') {
                this.props.deleteTPEvent(this.selectedRows[i].id, 'TP');
                this.setState({isSelected: false});
            } else {
                this.snackbar.error('Unable to delete a trade promotion whose status is not Draft');
            }
        }

    };

    isChecked = () => {
        if (this.api.getSelectedRows().length > 0) {
            this.setState({isSelected: true});
        } else {
            this.setState({isSelected: false});
        }
    };

    /**
     * Initialize customized columns based on columns of the grid TODO: do this for key figure columns only, dont forget to change logic of drag and drop idx+1
     * @returns {Array}
     */
    getCustomizedColumns = () => {
        const colsArr = [];
        // shouldComponentUpdate(nextProps, nextState, nextContext) {
        //     if (nextProps.data !== this.props.data || nextState !== this.state) {
        //         this.state.rowData = nextProps.data;
        //         return true
        //     }
        //     return true;
        //
        // }

        this.columnApi.getAllGridColumns().forEach((col) => {
            if (!col.getColDef().checkboxSelection) { // dont care about checkbox column
                const colObj = {id: col.getColId(), value: col.getColDef().headerName, checked: col.isVisible()};
                colsArr.push(colObj);
            }
        });
        return colsArr;
    };

    /**
     * Drag and drop event handler, created a new customized columns list to reflect the updated order
     * @param result
     */
    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newList = [...this.state.customizedColumns];
        const [removed] = newList.splice(result.source.index, 1);
        newList.splice(result.destination.index, 0, removed);

        this.setState({customizedColumns: newList});
    };

    /**
     * Customize table button even handler, set state to opened
     * @param event
     */
    onCustomizeTable = (event) => {
        this.setState({isCustomizeOpen: true});
    };

    /**
     * Customize table checkbox selection handler, sets checked flag in customized columns
     * @param col
     * @returns {Function}
     */
    onCustomizeTableCheck = col => event => {
        const newCols = this.state.customizedColumns.map((obj, idx) => {
            if (obj.value === col.value) {
                obj.checked = !obj.checked;
            }
            return obj;
        });
        this.setState({customizedColumns: newCols});
    };

    /**
     * Customize table Apply onClick handler, hides and orders columns
     */
    onCustomizeTableApply = () => {
        this.state.customizedColumns.forEach((obj, idx) => {
            this.columnApi.moveColumn(obj.id, idx + 1); // idx + 1 to ignore checkbox column
            this.columnApi.setColumnVisible(obj.id, obj.checked); // column visibility
        });
        this.setState({isCustomizeOpen: false});
    };

    /**
     * Resize all columns to minimum width
     * @param params
     */
    onDataFirstRendered = (params) => {
        params.columnApi.autoSizeColumns(['external_id', 'description', '1', '2', '3', '4']);
    };

    /**
     * Set instance references to ag grid apis, initialize customized columns for Customize Table
     * @param params
     */
    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.setState({customizedColumns: this.getCustomizedColumns()});
    };

    onSearch = (event) => {
        if (event.type === 'click' || event.keyCode === 13) {
            this.api.setQuickFilter(document.getElementById('tp_search_input').value);
        }
    };

    /**
     * Copy promos & container
     */
    onCopyTable = (event) => {
        this.setState({isCopyOpen: true});
    };

    onCopyCancel = (event) => {
        this.setState({isCopyOpen: false,
                                  level: 'Day(s)',
                                 increment:'0',
                                    copies:'0'})
    };

    toggle = () => {
        this.setState({
            disabled: !this.state.disabled,
        });
    };

    handleChange = (value, state_value) => {
        if (state_value === 'increment') {
            this.setState({
                [state_value]: value
            });

            } else if (state_value === 'copies') {
                this.setState({
                    copies: value,
            });
        }
    };

    onChange = (value) => {
        console.log('changed', value);
     };

    handleCopy = () => {
        this.selectedRows = this.api.getSelectedRows();
        for (let i = 0; i < this.selectedRows.length; i++) {
            if (this.selectedRows[i]) {
                this.props.copyTPEvent(this.selectedRows[i].id, 'TP', this.state.increment, this.state.level, this.state.copies);
                this.setState({isSelected: false});
            } else {
                this.snackbar.error('Unable to copy a trade promotion'); //required if cancel is not allowed
            }
        }
        this.setState({isCopyOpen: false});

    };

    render() {
        return (
            <Styled.TPGridContent className='ag-theme-material'>
                {this.state.isSelected ?
                    (<Grid container>
                        <Grid item xs={5}>
                            <Grid container justify={'flex-start'}>
                                <Box style={{width: '10rem', margin:'.5rem', align:"center"}}>
                                        {this.api.getSelectedRows().length}{'  '}
                                        Items Selected
                                    </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container justify={'flex-end'}>
                                <Button onClick={this.onCopyTable} style={{fontSize: '.8rem'}}>
                                    <FileCopyOutlinedIcon fontSize={'small'} style={{paddingRight: 3}}/>
                                    Copy
                                </Button>
                                <CustomizedDialog open={this.state.isCopyOpen}
                                             title={<div>
                                                <img src={CopyIcon} style={{paddingRight: 20}}/>
                                                Copy Events
                                             </div>}
                                           cancelText={'CANCEL'}
                                           onCancel={this.onCopyCancel}
                                           onSubmit={this.handleCopy}
                                           submitText={'APPLY'}>
                                    {/*<div>*/}
                                        <div>
                                            <div style={{margin: '1rem', width: '28rem', display: "flex"}}>
                                                <div style={{margin: '1rem', width: '8rem', display: "flex",  fontSize: 'large'}} >
                                                    Shift Dates By
                                                </div>
                                                <div style={{margin: '1rem', width: '5rem', display: "flex"}}>
                                                    <InputANTD defaultValue={this.state.increment} id={'increment'}
                                                               style={{ width: 60,}}
                                                               min={-50} max={50}
                                                               disabled={this.state.disabled}
                                                               onChange={(e) => this.handleChange(e, 'increment')}/>
                                                </div>
                                                <div style={{width: '10rem', display: "flex"}}>
                                                    <TextField
                                                      id={'level'}
                                                      style={{ width: 100}}
                                                      select
                                                      // label="Select"
                                                      value={this.state.level}
                                                      onChange={event => {
                                                        const { value } =event.target;
                                                        this.setState({level: value});
                                                      }}
                                                      SelectProps={{
                                                        MenuProps: {
                                                          width: 100,
                                                        },
                                                      }}
                                                      margin="normal">
                                                      {levels.map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                          {option.value}
                                                        </MenuItem>
                                                      ))}
                                                    </TextField>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{margin: '1rem', width: '28rem', display: "flex"}}>
                                                    <div style={{margin: '1rem', width: '8rem', display: "flex",  fontSize: 'large'}} >
                                                        Copies
                                                    </div>
                                                    <div style={{margin: '1rem', width: '5rem', display: "flex"}}>
                                                        <InputANTD defaultValue={this.state.copies} id={'copies'}
                                                                   style={{ width: 60 }}
                                                                   min={0} max={12}
                                                                   disabled={this.state.disabled}
                                                                   onChange={(e) => this.handleChange(e, 'copies')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {/*</div>*/}
                                </CustomizedDialog>
                                <Button onClick={this.handleDelete} style={{fontSize: '.8rem'}}>
                                    <Delete fontSize={'small'} style={{paddingRight: 3}}/>
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>)
                    :
                    (<Grid container>
                        <Grid item xs={6}>
                            <Grid container justify={'flex-start'}>
                                <Input id={'tp_search_input'} onKeyUp={this.onSearch} endAdornment={
                                    <InputAdornment position={'end'}>
                                        <IconButton onClick={this.onSearch}>
                                            <SearchIcon fontSize={'small'} style={{paddingRight: 3}}/>
                                        </IconButton>
                                    </InputAdornment>
                                }/>
                                <Button style={{color: 'rgba(61,69,81)'}}>
                                    <Add fontSize={'small'} fontWeight={'500'}/>
                                    <Link to={{pathname: '/promoevent/new', state: {kind: 'POST'}}} style={{color: 'rgba(61,69,81)'}}>
                                        Create Promotion
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
                                <CustomizedDialog onClose={() => this.setState({isCustomizeOpen: false})}
                                                  open={this.state.isCustomizeOpen}
                                                  title={'Customize Table'}
                                                  submitText={'APPLY'}
                                                  onSubmit={this.onCustomizeTableApply}>
                                    <div style={{margin: '2rem', width: '25rem'}}>
                                        <Typography variant={'h6'}>
                                            Key Figures
                                        </Typography>
                                        <Paper>
                                            <DragDropContext onDragEnd={this.onDragEnd}>
                                                <Droppable droppableId='droppable'>
                                                    {(provided, snapshot) => (
                                                        <RootRef rootRef={provided.innerRef}>
                                                            <List>
                                                                {this.state.customizedColumns.map((col, index) => (
                                                                    <Draggable key={col.id}
                                                                               draggableId={col.id}
                                                                               index={index}>
                                                                        {(provided, snapshot) => (
                                                                            <ListItem dense
                                                                                      ContainerComponent='li'
                                                                                      ref={provided.innerRef}
                                                                                      {...provided.draggableProps}
                                                                                      {...provided.dragHandleProps}
                                                                                      style={{...snapshot.isDragging, ...provided.draggableProps.style}}>
                                                                                <ListItemIcon>
                                                                                    <Checkbox color='primary'
                                                                                        onChange={this.onCustomizeTableCheck(col)}
                                                                                        checked={col.checked}/>
                                                                                </ListItemIcon>
                                                                                <ListItemText
                                                                                    primary={col.value}/>
                                                                                <ListItemIcon>
                                                                                    <DragIndicatorIcon/>
                                                                                </ListItemIcon>
                                                                            </ListItem>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </List>
                                                        </RootRef>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        </Paper>
                                    </div>
                                </CustomizedDialog>
                            </Grid>
                        </Grid>
                    </Grid>)}

                <AgGridReact
                    onGridReady={this.onGridReady}
                    columnDefs={this.state.columnDefs}
                    onFirstDataRendered={this.onDataFirstRendered}
                    rowSelection={'multiple'}
                    onRowSelected={this.isChecked}
                    suppressRowClickSelection={true}
                    rowData={this.props.data}
                    frameworkComponents={this.state.frameworkComponents}
                    getRowHeight={(params) => {
                        return 40
                    }}
                    getRowStyle={(params) => {
                        let color = params.node.rowIndex % 2 !== 0 ? '#EBEDF0' : '#fff';
                        return {'background-color': color}

                    }}
                />
                <CustomizedSnackbar ref={el => this.snackbar = el}/>
            </Styled.TPGridContent>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentTab: state.App.currentTab
    }
};

const mapDispatchToProps = dispatch => {
    return {
        deleteTPEvent: (event_id) => dispatch(action.deleteEvent(event_id, 'TP')),
        copyTPEvent: (event_id, event_type, increment, level, copies) => dispatch(action.copyEvent(event_id,  'TP', increment, level, copies)),
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(EventContainerGrid);
