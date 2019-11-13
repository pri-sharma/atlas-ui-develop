import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import appActions from '../../redux/app/actions';
import {Layout} from 'antd';
import options from './options';
import SiderWrapper from './sidebar.style';
import Menu from '../../components/uielements/menu';
import Scrollbars from '../../components/utility/customScrollBar';
import LabeledLogoIcon from '../../components/labeledIcon/LabeledLogoIcon';
import LabeledIcon from '../../components/labeledIcon/LabeledIcon';

const {Sider} = Layout;
const {
    changeOpenKeys,
    changeCurrent,
} = appActions;

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.clearClick = this.clearClick.bind(this);
    }


    handleClick(e) {
        if (e.key === 'admin') {
            window.location.href = process.env.REACT_APP_API_URL + '/admin';  // Lol we'll do it live
        }
        this.props.changeCurrent([e.key]);
    }

    clearClick() {
        this.props.changeCurrent([null]);
    }

    onOpenChange(newOpenKeys) {
        const {app, changeOpenKeys} = this.props;
        const latestOpenKey = newOpenKeys.find(
            key => !(app.openKeys.indexOf(key) > -1)
        );
        const latestCloseKey = app.openKeys.find(
            key => !(newOpenKeys.indexOf(key) > -1)
        );
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        changeOpenKeys(nextOpenKeys);
    }

    getAncestorKeys = key => {
        const map = {
            sub3: ['sub2']
        };
        return map[key] || [];
    };
    getMenuItem = ({singleOption}) => {
        const {currentTab} = this.props.app;
        const {key, label, icon} = singleOption;
        return (
            <Menu.Item key={key} className='customClass'>
                <Link
                    to={(currentTab && key === 'baseline_volume_planning') ? `/${this.props.app.currentTab}` : key === 'admin' ? '' : `/${key}`}>
                </Link>
                <LabeledIcon icon={icon} label={label}/>
            </Menu.Item>

        );
    };

    render() {
        const {app} = this.props;

        return (
            <SiderWrapper>
                <Sider className='customSiderBar' width='72'
                       /*breakpoint='lg' collapsedWidth='0'*/ mode='dark'>
                    <Scrollbars>
                        <LabeledLogoIcon clearClickCB={this.clearClick}/>
                        <Menu onClick={this.handleClick}
                              theme='dark'
                              className='customAntMenu'
                              selectedKeys={app.current}
                              onOpenChange={this.onOpenChange}>
                            {options.map(singleOption =>
                                this.getMenuItem({singleOption})
                            )}
                        </Menu>
                    </Scrollbars>
                </Sider>
            </SiderWrapper>
        );
    }
}

export default connect(
    state => ({
        app: state.App,
        height: state.App.height
    }),
    {changeOpenKeys, changeCurrent}
)(Sidebar);