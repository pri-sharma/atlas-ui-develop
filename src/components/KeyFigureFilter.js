import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {Checkbox, List, ListItem, ListItemIcon, ListItemText, RootRef} from "@material-ui/core";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {DragIndicator} from "@material-ui/icons";

class KeyFigureFilter extends React.Component {

    // did you know that React passes props to your component constructor??
    constructor(props) {
        super(props);
        // from here you can access any of the props!
        // this.valueGetter = this.props.valueGetter;

        // this.onChange = this.onChange.bind(this);

        let kfgSet = new Set();
        props.api.forEachNode(node => kfgSet.add(node.data.key_figure));

        this.state = {
            customizedColumns: Array.from(kfgSet),
            // kfgArray: Array.from(kfgSet),
        };

        console.log('The field for this filter is ' + props.colDef.field);
    }

    // maybe your filter has a button in it, and when it gets clicked...
    // onButtonWasPressed() {
    //     // all the methods in the props can be called
    //     this.props.filterChangedCallback();
    // }

    doesFilterPass(params) {
        debugger;
        return true;
    }

    onChange(event) {
        debugger
        // let newValue = event.target.value;
        // if (this.state.text !== newValue) {
        //     this.setState({
        //         text: newValue
        //     }, () => {
        //         this.props.filterChangedCallback();
        //     });
        //
        // }
    }

    /**
     * Customize table checkbox selection handler, sets checked flag in customized columns
     * @param col
     * @returns {Function}
     */
    onCustomizeTableCheck = col => event => {
        debugger
        // const newCols = this.state.customizedColumns.map((obj, idx) => {
        //     if (obj.value === col.value) {
        //         obj.checked = !obj.checked;
        //     }
        //     return obj;
        // });
        // this.setState({customizedColumns: newCols});
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


    render() {
        debugger
        return (
            <div>
                {/*{this.state.kfgArray.map(item => (*/}
                {/*    <div>*/}
                {/*        <Checkbox onChange={this.onCustomizeTableCheck(col)}*/}
                {/*                  checked={col.checked}/>*/}
                {/*        <li key={item}> {item} </li>*/}
                {/*    </div>*/}
                {/*))}*/}
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId='droppable'>
                        {(provided, snapshot) => (
                            <RootRef rootRef={provided.innerRef}>
                                <List>
                                    <ListItem dense
                                              ContainerComponent='li'>
                                        <ListItemIcon>
                                            <Checkbox color='primary'
                                                onChange={this.onCustomizeTableCheck('(Select All)')}
                                                checked={true}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={'(Select All)'}/>
                                    </ListItem>
                                    {this.state.customizedColumns.map((col, index) => (
                                        <ListItem dense
                                                  ContainerComponent='li'>
                                            <ListItemIcon>
                                                <Checkbox color='primary'
                                                    onChange={this.onCustomizeTableCheck(col)}
                                                    checked={true}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={col}/>
                                        </ListItem>

                                    ))}
                                    {provided.placeholder}
                                </List>
                            </RootRef>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        planningConfig: state.PlannableCustomers.planningConfig,
    }
};


export default connect(mapStateToProps)(KeyFigureFilter);

