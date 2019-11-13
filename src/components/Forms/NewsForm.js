import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../redux/news/actions';
import * as salesorg_actions from '../../redux/customerGroups/actions';
import Form from '../../components/uielements/form';
import {Modal, Select, DatePicker, Input} from 'antd';

const { TextArea } = Input;
const {Option} = Select;
const FormItem = Form.Item;

let salesorg_list;

class NewsForm extends Component {

    state = {
        sales_org: null,
        title: '',
        body: ''
    };

    componentDidMount(){
        this.props.getSalesOrg();

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

    handleChange = (e, type='') => {
        this.setState({
            [type]: e
        })
    };

    handleInputChange(e, type = ''){
        this.setState({
            [type]: e.target.value
        });
    };

    handleInputChangeDescription(e, type = ''){
        this.setState({
            [type]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.props.id){
            this.props.createNews(this.state)
        }
        else {
            this.props.updateNews(this.state, this.props.id)
        }

        this.props.handleClose()
    };

    handleSalesOrgChange = (e) => {
        this.setState({
            sales_org: e
        });
    };

    createSalesOrgOptions = () => {
        if (this.props.salesorg) {
            salesorg_list = this.props.salesorg.map(sorg => {
                return (
                    <option key={sorg.id} value={sorg.id}>{sorg.sales_org + " - " + sorg.description}</option>
                )
            });
        }
    };

    render() {

        this.createSalesOrgOptions();

        return (

            <Modal visible={true}
                   okText={this.props.kind === 'POST' ? 'Create News' : 'Update News'}
                   onOk={this.handleSubmit}
                   title={this.props.kind === 'POST' ? 'Create A New News' : 'Update News'}
                   onCancel={this.props.handleClose}
            >
                <Form>
                    <FormItem label='Title'>
                        <Input defaultValue={this.state.title} placeholder={'Title'} onChange={(e) => this.handleInputChange(e, 'title')} id='title'>
                        </Input>
                    </FormItem>
                    <FormItem label='Description'>
                        <TextArea rows={4} defaultValue={this.state.body} placeholder={'Description'} onChange={(e) => this.handleInputChangeDescription(e, 'body')} id='body'>
                        </TextArea>
                    </FormItem>
                    <FormItem label='Sales Org'>
                        <Select defaultValue={this.state.sales_org} id='salesorg' onChange={(e) => this.handleSalesOrgChange(e)}>
                            {salesorg_list}
                        </Select>
                    </FormItem>
                </Form>
            </Modal>

        )
    }
}

const mapStateToProps = state => {
    return {
        salesorg: state.CustomerGroup.salesorg,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        createNews: (news) => dispatch(actions.addNewsAction(news)),
        updateNews: (news_id, update) => dispatch(actions.updateNewstAction(news_id, update)),
        getSalesOrg: ()=> dispatch(salesorg_actions.getSalesOrgActions())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsForm)