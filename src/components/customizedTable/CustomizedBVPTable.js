import React, {Component, Fragment} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import CustomizedDialog from '../customizedDialog/CustomizedDialog';
import Customize from '../../images/Customize.png';
import {Styled} from './CustomizedTable.style';

export default class CustomizedBVPTable extends Component {
    constructor(props) {
        super(props);

        this.currentCols = this.props.columns;
        this.currentKFCols = this.props.kfColumns;
        this.currentTimeCols = this.props.timeColumns;
        this.state = {
            customizedColumns: [],
            customizedKFColumns: [],
            customizedTimeColumns: [],
            isCustomizeOpen: false,
        };
    }

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

        const newKFCols = this.state.customizedKFColumns.map((obj, idx) => {
            if (obj.value === col.value) {
                obj.checked = !obj.checked;
            }
            return obj;
        });

        const newTimeCols = this.state.customizedTimeColumns.map((obj, idx) => {
            if (obj.value === col.value) {
                obj.checked = !obj.checked;
            }
            return obj;
        });

        this.setState({customizedColumns: newCols, customizedKFColumns: newKFCols, customizedTimeColumns: newTimeCols});
    };

    /**
     * Drag and drop event handler, created a new customized columns list to reflect the updated order
     * @param result
     */
    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newList = [...this.state.customizedKFColumns];
        const [removed] = newList.splice(result.source.index, 1);
        newList.splice(result.destination.index, 0, removed);

        this.setState({customizedKFColumns: newList});
    };

    /**
     * Customize table Apply onClick handler, update currentCols, reset the customizedColumns state, and update grid
     */
    onApply = () => {
        this.currentCols = this.state.customizedColumns;
        this.currentKFCols = this.state.customizedKFColumns;
        this.currentTimeCols = this.state.customizedTimeColumns;
        this.setState({
            isCustomizeOpen: false,
            customizedColumns: [],
            customizedKFColumns: [],
            customizedTimeColumns: [],
        });
        this.props.customColDefsCB(this.currentCols, this.currentKFCols, this.currentTimeCols);
    };

    /**
     * Customize table button handler, set state to opened and clone copy the currentCols
     * @param event
     */
    onOpen = (event) => {
        this.setState({
            isCustomizeOpen: true,
            customizedColumns: cloneColumns(this.currentCols),
            customizedKFColumns: cloneColumns(this.currentKFCols),
            customizedTimeColumns: cloneColumns(this.currentTimeCols),
        });
    };

    /**
     * Customize table button even handler, set state to closed and throw away the customizedColumns state changes
     * @param event
     */
    onCancel = (event) => {
        this.setState({
            isCustomizeOpen: false,
            customizedColumns: [],
            customizedKFColumns: [],
            customizedTimeColumns: [],
        });
    };

    render() {
        return (
            <Fragment>
                <Button onClick={this.onOpen} style={{fontSize: '.8rem'}}>
                    <TableChartOutlinedIcon fontSize={'small'} style={{color: 'black'}}/>
                    Customize Table
                </Button>
                <CustomizedDialog onClose={this.onCancel}
                                  open={this.state.isCustomizeOpen}
                                  img={Customize}
                                  title={'Customize Table'}
                                  submitText={'APPLY'}
                                  onSubmit={this.onApply}>
                    <Styled.CustomizeContent>
                        <div className='content-card'>
                            <Typography variant={'h6'} className='content-title'>
                                Product Tree
                            </Typography>
                            <Paper>
                                <List>
                                    {this.state.customizedColumns.map((col, index) => (
                                        <ListItem dense key={col.id}>
                                            <ListItemIcon>
                                                <Checkbox color='primary'
                                                          checked={col.checked}
                                                          onChange={this.onCustomizeTableCheck(col)}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={col.value}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </div>
                        <div className='content-card'>
                            <Typography variant={'h6'} className='content-title'>
                                Reference Lines
                            </Typography>
                            <Paper>
                                <DragDropContext onDragEnd={this.onDragEnd}>
                                    <Droppable droppableId='droppable'>
                                        {(provided, snapshot) => (
                                            <RootRef rootRef={provided.innerRef}>
                                                <List>
                                                    {this.state.customizedKFColumns.map((col, index) => (
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
                        <div className='content-card'>
                            <Typography variant={'h6'} className='content-title'>
                                Units Of Time
                            </Typography>
                            <Paper>
                                <List>
                                    {this.state.customizedTimeColumns.map((col, index) => (
                                        <ListItem dense key={col.id}>
                                            <ListItemIcon>
                                                <Checkbox color='primary'
                                                          checked={col.checked}
                                                          onChange={this.onCustomizeTableCheck(col)}/>

                                            </ListItemIcon>
                                            <ListItemText
                                                primary={col.value}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </div>
                    </Styled.CustomizeContent>
                </CustomizedDialog>
            </Fragment>
        )
    }
}

function cloneColumns(initialCols) {
    return initialCols.map(col => {
        return {...col};
    });
}