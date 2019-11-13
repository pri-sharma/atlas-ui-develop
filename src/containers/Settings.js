import React, { PureComponent } from 'react';
import {bindActionCreators} from 'redux';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import {connect} from 'react-redux';
import * as actions from '../redux/userSettings/actions';
import ContentHolder from '../components/utility/contentHolder'
import {Select, Button, Row, Col, Spin} from "antd";


let language_list, decimal_list, thousands_list, date_list;
class Settings extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        language: 'EN',
        decimal_format: '2',
        thousands_format: 'thousand',
        date_format: 'MM-DD-YY',
        language_list:['EN-US', 'EN-UK', 'SPN'],
        decimal_list:['1', '2', '3', '4'],
        thousands_list:['thousand', 'lakh', 'wan'],
        date_list:['MM-DD-YY', 'YYYY/MM/DD', 'MM/DD/YYYY', 'DD.MM.YYYY'],
    };

    handleLanguageChange = (e) => {
        this.setState({
            language: e
        });
    };

    handleDecimalChange = (e) => {
        this.setState({
            decimal_format: e
        });
    };

    handleDateChange = (e) => {
        this.setState({
            date_format: e
        });
    };

    handleThousandsChange = (e) => {
        this.setState({
            thousands_format: e
        });
    };

    componentDidMount() {
        this.props.getUserSettings();
        this.props.getLanguages();
    }

    createLanguageOptions = () =>{
        language_list = this.props.languages.map((item, id)=>{
            return(<Select.Option key={id} value={item}>{item}</Select.Option>)
        })
    };

    createDateOptions = () =>{
        date_list = this.state.date_list.map((item, id)=>{
            return(<Select.Option key={id} value={item}>{item}</Select.Option>)
        })
    };

    createDecimalOptions = () =>{
        decimal_list = this.state.decimal_list.map((item, id)=>{
            return(<Select.Option key={id} value={item}>{item}</Select.Option>)
        })
    };

    createThousandOptions = () =>{
        thousands_list = this.state.thousands_list.map((item, id)=>{
            return(<Select.Option key={id} value={item}>{item}</Select.Option>)
        })
    };

    saveUserSettings = () => {
        this.props.saveUserSettings(this.state);
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.user_settings){
            this.setState({
                language: nextProps.user_settings.language,
                //decimal_format: nextProps.user_settings.decimal_format,
                thousands_format: nextProps.user_settings.thousands_format,
                date_format: nextProps.user_settings.date_format,
            })
        }
    }

    render() {

    this.createLanguageOptions();
    this.createDateOptions();
    //this.createDecimalOptions();
    this.createThousandOptions();

    if (this.props.pending) {  // loading data
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <Spin size='large'/>
                </div>
            )
    } else {
        return (
            <LayoutContentWrapper style={{height: '100vh'}}>
                <LayoutContent>
                    {/*{this.state.show_alert && <Alert type="success" message="Settings have been successfully updated" banner closable onClose={this.onAlertClose}/>}*/}

                    <div style={{marginTop: 20}}>
                        <Row align="middle">
                            <Col span={6}>
                                <h1>Product Description Language</h1>
                            </Col>
                            <div>
                                <Col span={12}>
                                    <Select style={{width: '85%', marginRight: 8}} option value={this.state.language}
                                            defaultValue={this.state.language} id='salesorg'
                                            onChange={(e) => this.handleLanguageChange(e)}>
                                        <Select.Option disabled={true} value={''}>Language</Select.Option>
                                        {language_list}
                                    </Select>
                                </Col>
                            </div>
                        </Row>
                    </div>

                    {/*<div style={{marginTop: 20}}>*/}
                    {/*    <Row align="middle" marginTop={10}>*/}
                    {/*        <Col span={6}>*/}
                    {/*            <h1>Decimal Point</h1>*/}
                    {/*        </Col>*/}
                    {/*        <div>*/}
                    {/*            <Col span={12}>*/}
                    {/*                <Select style={{width: '85%', marginRight: 8}} option*/}
                    {/*                        value={this.state.decimal_format} defaultValue={this.state.decimal_format}*/}
                    {/*                        id='salesorg' onChange={(e) => this.handleDecimalChange(e)}>*/}
                    {/*                    <Select.Option disabled={true} value={''}>Decimal Format</Select.Option>*/}
                    {/*                    {decimal_list}*/}
                    {/*                </Select>*/}
                    {/*            </Col>*/}
                    {/*        </div>*/}
                    {/*    </Row>*/}
                    {/*</div>*/}

                    <div style={{marginTop: 20}}>
                        <Row align="middle">
                            <Col span={6}>
                                <h1>Date Format</h1>
                            </Col>
                            <div>
                                <Col span={12}>
                                    <Select style={{width: '85%', marginRight: 8}} option value={this.state.date_format}
                                            defaultValue={this.state.date_format} id='salesorg'
                                            onChange={(e) => this.handleDateChange(e)}>
                                        <Select.Option disabled={true} value={''}>Date Format</Select.Option>
                                        {date_list}
                                    </Select>
                                </Col>
                            </div>
                        </Row>
                    </div>

                    <div style={{marginTop: 20}}>
                        <Row align="middle">
                            <Col span={6}>
                                <h1>Thousands Format</h1>
                            </Col>
                            <div>
                                <Col span={12}>
                                    <Select style={{width: '85%', marginRight: 8}} option
                                            value={this.state.thousands_format}
                                            defaultValue={this.state.thousands_format} id='salesorg'
                                            onChange={(e) => this.handleThousandsChange(e)}>
                                        <Select.Option disabled={true} value={''}>Thousands Format</Select.Option>
                                        {thousands_list}
                                    </Select>
                                </Col>
                            </div>
                        </Row>
                    </div>

                    <div style={{marginTop: 20}}>
                        <Button title={'Save'} onClick={this.saveUserSettings}>Save</Button>
                    </div>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
  }
}


const mapStateToProps = state => {
    return {
        pending: state.UserSettings.pending,
        user_settings: state.UserSettings.settings,
        languages: state.UserSettings.languages,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getUserSettings: actions.getUserSettingsAction,
        getLanguages: actions.getLanguageListAction,
        saveUserSettings: actions.addUserSettings,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
