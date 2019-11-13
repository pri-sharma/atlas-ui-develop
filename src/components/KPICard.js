import React, {Component} from 'react';
import CustomizedDialog from './customizedDialog/CustomizedDialog';
import {Create, DragIndicator} from '@material-ui/icons';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    RootRef,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';

const headerStyle = {
    fontSize: '112.5%',
    fontWeight: '500',
    display: 'inline-block',
    lineHeight: '117%',
    position: 'relative',
    width: '50%',
    height: '20%',
    color: '#000000',
    whiteSpace: 'nowrap'
};

const editStyle = {
    fontSize: '.775rem',
    fontWeight: '500',
    display: 'inline-block',
    lineHeight: '117%',
    position: 'relative',
    right: '-128%',
};

const COLORS = {
    RED: '#DA291D',
    GREEN: '#2FA84F',
    BLACK: '#090A0C'
};

const cellStyles = (color) => {
    return {
        fontWeight: '500',
        fontSize: '86%',
        color: color,
        borderBottom: 'none',
        lineHeight: '117%',
        textAlign: 'center',
        padding: '2.5% 0%',
        minWidth: '1%',
        maxWidth: '10%',
        whiteSpace: 'nowrap',
    }
};

class KPICard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: this.props.rows,
            trackRowChanges: this.props.rows,
            trackColumnChanges: this.props.rows,
            selectedSource: this.getTitle(this.props.rows),
            selectedKPIs: this.props.columns,
            rows: this.createRows(this.props.rows, this.props.columns),
            columns: this.createColumns(this.props.columns),
            rowSelections: this.getTitle(this.props.rows),
            columnSelections: this.props.columns,
            sources: this.initializeSelection(this.getTitle(this.props.rows)),
            KPIs: this.initializeSelection(this.props.columns),
        }
    }

    getTitle = () => {
        let tempData = {...this.props.rows};
        const rowSelections = [];
        for (let i = 0; i < Object.keys(tempData).length; i++) {
            rowSelections.push(tempData[i].title);
        }
        return rowSelections;
    };

    handleClickOpen = (event) => {
        this.setState({open: true});
        this.setState({anchorEl: event.currentTarget})
    };

    handleClose = () => {
        this.setState({open: false})
    };

    handleColumnChange = event => {
        const temp = {...this.state.KPIs, [event.target.value]: event.target.checked};
        const selectedKPIs = this.state.columnSelections.filter(key => temp[key]);
        this.setState({KPIs: temp, selectedKPIs: selectedKPIs});
    };

    handleRowChange = event => {
        const tempSource = {...this.state.sources, [event.target.value]: event.target.checked};
        const tempRows = [];
        const hiddenRows = [];
        let updatedData = {...this.state.trackColumnChanges};
        Object.keys(tempSource).forEach(function (key) {
            (tempSource[key]) ? tempRows.push(key) : hiddenRows.push(key);
        });
        const newlyUpdatedData = [];
        let idx = 0;
        for (let i = 0; i < Object.keys(updatedData).length; i++) {
            if (tempRows.includes(updatedData[i].title)) {
                newlyUpdatedData.push(updatedData[i]);
                idx++;
            }
        }
        this.setState({sources: tempSource, data: newlyUpdatedData});

    };

    handleSubmit = () => {
        const newData = this.createRows(this.state.data, this.state.selectedKPIs);
        const newCol = this.createColumns(this.state.selectedKPIs);
        this.setState({rows: newData, columns: newCol, open: false});
    };

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const filtered = Object.keys(this.state.KPIs).filter(key => this.state.KPIs[key]); // use this line to replace selectedKPIS
        if (this.props.columns.includes(result.draggableId)) {
            let kpiList = [...this.state.columnSelections];
            const [removedKPI] = kpiList.splice(result.source.index, 1);
            kpiList.splice(result.destination.index, 0, removedKPI);
            const selectedKPIs = kpiList.filter(key => this.state.KPIs[key]);
            this.setState({columnSelections: kpiList, selectedKPIs: selectedKPIs});
        } else {

            const sourceList = [...this.state.rowSelections];

            const orderChange = [...this.state.trackColumnChanges];
            const [removedRow] = orderChange.splice(result.source.index, 1);
            orderChange.splice(result.destination.index, 0, removedRow);

            const wholeDataChange = [...this.props.rows];
            const [draggedRow] = wholeDataChange.splice(result.source.index, 1);
            wholeDataChange.splice(result.destination.index, 0, draggedRow);

            const newList = [...this.state.trackRowChanges];
            const idxAdjustment = sourceList.length - newList.length;
            const [removed] = newList.splice(result.source.index - idxAdjustment, 1);
            newList.splice(result.destination.index - idxAdjustment, 0, removed);

            const [removedTitle] = sourceList.splice(result.source.index, 1);
            sourceList.splice(result.destination.index, 0, removedTitle);
            this.setState({
                trackRowChanges: newList,
                data: newList,
                rowSelections: sourceList,
                trackColumnChanges: orderChange
            })
        }
    };

    initializeSelection = (arr) => {
        let result = {};
        arr.forEach((item) => result[item] = true);
        return result;
    };

    createColumns = (cols) => {
        let columns = cols.map(column => {
            return <TableCell key={column} style={cellStyles(COLORS.BLACK)}>{column}</TableCell>
        });
        return [<TableCell key={'firstColumn'} style={cellStyles(COLORS.BLACK)}/>, ...columns];
    };

    createRows = (rs, cols) => {
        let rows = rs.map(row => {
            return (<TableRow key={row.title}>
                <TableCell key={row.title} style={cellStyles(COLORS.BLACK)} component={'th'} scope={'row'}>
                    {row.title}
                </TableCell>
                {cols.map(column => {
                    let color = row[column].includes('+') ? COLORS.GREEN : row[column].includes('-') ? COLORS.RED : COLORS.BLACK;
                    return <TableCell key={column} style={cellStyles(color)}>{row[column]}</TableCell>
                })}
            </TableRow>)
        });
        return rows
    };

    render() {
        return (
            <Card style={this.props.style}>
                <CardContent style={this.props.style}>
                    <Typography style={{marginBottom: '5%', minWidth: '100%'}}>
                        <span style={headerStyle}>
                            {this.props.title}
                        </span>
                        <span style={editStyle}>
                            <Button style={{fontSize: '.775rem', color: '#3D4551'}}
                                    onClick={this.handleClickOpen}>
                                <Create style={{fontSize: '14px', position: 'relative'}}/>
                                EDIT KPI'S
                            </Button>
                            <CustomizedDialog
                                title={"Select KPI's"}
                                submitText={'Apply'}
                                onClose={this.handleClose}
                                open={this.state.open}
                                onSubmit={this.handleSubmit}
                            >
                                <div style={{width: '45rem', margin: '2rem'}}>
                                <Grid container spacing={5}>
                                        <Grid item xs={6}>
                                            <Typography style={{fontSize: '18px', fontWeight: '500'}}
                                            >{'Source(Rows)'}</Typography>
                                            <Paper style={{height: '100%'}}>
                                                 <DragDropContext onDragEnd={this.onDragEnd}>
                                                        <Droppable droppableId='droppable'>
                                                            {(provided, snapshot) => (
                                                                <RootRef rootRef={provided.innerRef}>
                                                                    <List>

                                                                        {this.state.rowSelections.map((title, index) => (
                                                                            <Draggable key={title}
                                                                                       draggableId={title}
                                                                                       index={index}
                                                                                       isDragDisabled={!this.state.sources[title]}>
                                                                                {(provided, snapshot) => (
                                                                                    <ListItem dense
                                                                                              ContainerComponent='li'
                                                                                              ref={provided.innerRef}
                                                                                              {...provided.draggableProps}
                                                                                              {...provided.dragHandleProps}
                                                                                              style={{...snapshot.isDragging, ...provided.draggableProps.style}}>
                                                                                        <ListItemIcon>
                                                                                            <Checkbox color='primary'
                                                                                                      value={title}
                                                                                                      checked={this.state.sources[title]}
                                                                                                      onChange={this.handleRowChange}/>
                                                                                        </ListItemIcon>
                                                                                        <ListItemText primary={title}/>
                                                                                        {(this.state.sources[title]) ?
                                                                                            <ListItemIcon>
                                                                                                <DragIndicator/>
                                                                                            </ListItemIcon>
                                                                                            : null}
                                                                                    </ListItem>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                    </List>
                                                                </RootRef>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography style={{fontSize: '18px', fontWeight: '500'}}
                                            >{'Measure(Columns)'}</Typography>
                                            <Paper style={{height: '100%'}}>
                                                 <DragDropContext onDragEnd={this.onDragEnd}>
                                                        <Droppable droppableId='droppable'>
                                                            {(provided, snapshot) => (
                                                                <RootRef rootRef={provided.innerRef}>
                                                                    <List>

                                                                        {this.state.columnSelections.map((kpi, index) => (
                                                                            <Draggable key={kpi}
                                                                                       draggableId={kpi}
                                                                                       index={index}
                                                                                       isDragDisabled={!this.state.KPIs[kpi]}>
                                                                                {(provided, snapshot) => (
                                                                                    <ListItem dense
                                                                                              ContainerComponent='li'
                                                                                              ref={provided.innerRef}
                                                                                              {...provided.draggableProps}
                                                                                              {...provided.dragHandleProps}
                                                                                              style={{...snapshot.isDragging, ...provided.draggableProps.style}}>
                                                                                        <ListItemIcon>
                                                                                            <Checkbox color='primary'
                                                                                                onChange={this.handleColumnChange}
                                                                                                checked={this.state.KPIs[kpi]}
                                                                                                value={kpi}/>
                                                                                        </ListItemIcon>
                                                                                        <ListItemText primary={kpi}/>
                                                                                        {(this.state.KPIs[kpi]) ?
                                                                                            <ListItemIcon>
                                                                                                <DragIndicator/>
                                                                                            </ListItemIcon>
                                                                                            : null}
                                                                                    </ListItem>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                    </List>
                                                                </RootRef>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                </Paper>
                                        </Grid>
                                    </Grid>
                                </div>
                            </CustomizedDialog>
                        </span>
                    </Typography>
                    <Table className={'MuiTable-root'}
                           style={{borderRadius: '2%', maxWidth: '200%', minWidth: '190%', justifySelf: 'center'}}>
                        <TableHead>
                            <TableRow>
                                {this.state.columns}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }
}

export default KPICard;