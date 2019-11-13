import React, {Component} from 'react';
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

export default class CustomizedTable extends Component {
    constructor(props) {
        super(props);

        this.currentCols = this.props.columns;
        this.state = {
            customizedColumns: [],
            isCustomizeOpen: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        return false;
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
     * Customize table Apply onClick handler, update currentCols, reset the customizedColumns state, and update grid
     */
    onApply = () => {
        this.currentCols = this.state.customizedColumns;
        this.setState({isCustomizeOpen: false, customizedColumns: []});
        this.props.customColDefsCB(this.currentCols);
    };

    /**
     * Customize table button handler, set state to opened and clone copy the currentCols
     * @param event
     */
    onOpen = (event) => {
        this.setState({isCustomizeOpen: true, customizedColumns: cloneColumns(this.currentCols)});
    };

    /**
     * Customize table button even handler, set state to closed and throw away the customizedColumns state changes
     * @param event
     */
    onCancel = (event) => {
        this.setState({isCustomizeOpen: false, customizedColumns: []});
    };

    render() {
        return (<Grid item>
                <Button onClick={this.onOpen} style={{fontSize: '.8rem'}}>
                    <TableChartOutlinedIcon fontSize={'small'} style={{color: 'black'}}/>
                    Customize Table
                </Button>
                <CustomizedDialog onClose={this.onCancel}
                                  open={this.state.isCustomizeOpen}
                                  title={'Customize Table'}
                                  submitText={'APPLY'}
                                  onSubmit={this.onApply}>
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
        )
    }
}

function cloneColumns(initialCols) {
    return initialCols.map(col => {
        return {...col};
    });
}