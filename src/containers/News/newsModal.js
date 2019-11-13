import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class newsModal extends Component {

    state={
        modalVisible: true,
    }

    handleOk = () => {
        this.props.handleClose()
    }

    handleCancel = () => {
        this.props.handleClose()
    }

    render () {
        return (

            <Modal title={this.props.title} visible={this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <p>{this.props.body}</p>
            </Modal>
        );
    }
}

export default newsModal;