import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/attributes/actions';
import {Modal, Select, Input, Row, Col, Form, Icon, Button} from 'antd';
import moment from "moment";

const { TextArea } = Input;
const {Option} = Select;
const FormItem = Form.Item;

let id = 0;

class AttributesForm extends Component {

    state = {
        key: '',
        value: {},
        days_of_week: moment.weekdays(),
        attributes:['currency', 'start day of week', 'decimal format'],
        currency:['USD', 'INR', 'DIR', 'YEN'],
        decimal:['0.0', '0.00', '0.000', '0.0000'],
        attribute:'',
        btnClicked: false,
    };

    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {return;}
        form.setFieldsValue({keys: keys.filter(key => key !== k),});
      };

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({keys: nextKeys,});
      };

    componentDidMount(){
        // this.props.getSalesOrg();
        // console.log(moment.weekdays(),"week")

        if(this.props.type==="PATCH") {
            if(this.props.sales_org)
            {
                this.setState({
                    sales_org: this.props.sales_org.id
                })
            }
            this.setState({
                title: this.props.title,
                body: this.props.body,
            })
        }
    }

    componentWillMount() {

    }

    handleInputChange(e, type = ''){
        this.setState({
            [type]: e.target.value
        });
    };

    handleChange = (e, type='') => {
        this.setState({
            [type]: e
        })
    };

    handleClose = () => {
        this.setState({
            btnClicked: false,
            showAssignment: this.state.showAssignment
        })
    };


    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
          if (!err) {
            const { keys, names } = values;
            this.props.createAttribure(this.state, {...names})
          }
        });

        this.props.handleClose()
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItemLayoutWithOutLabel = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
          },
        };
        const formItems = keys.map((k, index) => (
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Value' : ''}
            required={false}
            key={k}
            style={{marginBottom:0}}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input a value or delete this field.",
                },
              ],
            })(<Input placeholder="value name" style={{ width: '60%', marginRight: 8 }} />)}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        ));

        const formItemLayout = {labelCol: {xs: { span: 24 }, sm: { span: 4 },},
                                wrapperCol: {xs: { span: 24 }, sm: { span: 20 },},};

        return (

            <Modal visible={true}
                   okText={this.props.kind === 'POST' ? 'Create' : 'Update'}
                   onOk={this.handleSubmit}
                   title={this.props.kind === 'POST' ? 'Create A New Attribute' : 'Update Attribute'}
                   onCancel={this.props.handleClose}
            >
                <Form {...formItemLayout}>

                    <FormItem label='Attribute' style={{marginBottom:0}}>
                        <Input defaultValue={this.state.key} placeholder={'Attribute Name'} onChange={(e) => this.handleInputChange(e, 'key')} id='key'>
                        </Input>
                    </FormItem>

                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel} >
                      <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add field
                      </Button>
                    </Form.Item>

                </Form>
            </Modal>

        )
    }
}

const mapStateToProps = state => {
    return {
        // salesorg: state.CustomerGroup.salesorg,
        attributes: state.Attributes.attributes,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        getAttributes: () => dispatch(actions.getAttributesAction()),
        createAttribure: (attributes, values) => dispatch(actions.addAttributesAction(attributes, values)),
        updateAttrubite: (attributes_id, update) => dispatch(actions.updateAttributesAction(attributes_id, update)),
    }
};
const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(AttributesForm);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedDynamicFieldSet)