import React, {Component} from 'react';
import {Button, Modal, Transfer} from "antd";
import {connect} from 'react-redux';
import * as actions from '../../../redux/events/actions';
let conditions = [];

class ConditionsTransfer extends Component {

    constructor(props){
        super(props);
        this.props.getConditions(this.props.eventType);

        this.state = {
            selected: this.props.selected
        };
    }

    renderConditions = () => {
        if(this.props.tpConditions && this.props.eventType === 'TP'){
            conditions = this.props.tpConditions.map(condition => {
                return {key: condition}
            })
        } else if(this.props.bspConditions && this.props.eventType === 'BSP'){
            conditions = this.props.bspConditions.map(condition => {
                return {key: condition}
            })
        }
        return conditions
    };

    handleChange = (targetKeys) => {
        this.setState({
            selected: targetKeys
        })
    };
    render() {
        this.renderConditions();
        return (
            <Modal visible title={'Add Conditions'} bodyStyle={{height: 450}} width={900} closable={false}
                   footer={<Button
                       onClick={() => this.props.handleClick(this.state.selected)}>Done</Button>}><Transfer
                dataSource={conditions}
                showSearch
                listStyle={{
                    width: 350,
                    height: 350,
                }}
                operations={['add', 'remove']}
                targetKeys={this.state.selected} //check this
                onChange={(targetKeys) => this.handleChange(targetKeys)}
                render={condition => `${condition.key.code}: ${condition.key.description}`}
            /></Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        tpConditions: state.Event.tpConditions,
        bspConditions: state.Event.bspConditions
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getConditions: (eventType) => dispatch(actions.getConditions(eventType))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionsTransfer)