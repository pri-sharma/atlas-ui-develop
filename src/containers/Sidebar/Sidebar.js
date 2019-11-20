import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import appActions from '../../redux/app/actions';
import { Layout } from 'antd';
import options from './options';
import SiderWrapper from './sidebar.style';
import Menu from '../../components/uielements/menu';
import Scrollbars from '../../components/utility/customScrollBar';
import LabeledLogoIcon from '../../components/labeledIcon/LabeledLogoIcon';
import LabeledIcon from '../../components/labeledIcon/LabeledIcon';


const { Sider } = Layout;
const {
    changeOpenKeys,
    changeCurrent,
    linkClick
} = appActions;

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.clearClick = this.clearClick.bind(this);
    }


    handleClick(e) {
        //alert(e.key)
        if (e.key != 'reporting') {
            this.removejscssfile("bootstrap.min.js", "js") //remove all occurences of "somescript.js" on page
            this.removejscssfile("bootstrap.min.css", "css") //remove all occurences "somestyle.css" on page
        } else {

            this.loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js", "js") //dynamically load and add this .js file
            this.loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css", "css") //dynamically load "javascript.php" as a JavaScript file
        }

        // backClick
        if (e.key === 'admin') {
            window.location.href = process.env.REACT_APP_API_URL + '/admin';  // Lol we'll do it live
        }
        this.props.changeCurrent([e.key]);
        this.props.linkClick(false)
    }

    loadjscssfile(filename, filetype) {
        if (filetype == "js") { //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype == "css") { //if filename is an external CSS file
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    removejscssfile = (filename, filetype) => {
        var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
        var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
                allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
        }
    }

    clearClick() {
        this.props.changeCurrent([null]);
    }

    onOpenChange(newOpenKeys) {
        const { app, changeOpenKeys, linkClick } = this.props;
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
    getMenuItem = ({ singleOption }) => {
        const { currentTab } = this.props.app;
        const { key, label, icon } = singleOption;
        if (this.props.app.current[0] != 'reporting') {
            this.removejscssfile("bootstrap.min.js", "js") //remove all occurences of "somescript.js" on page
            this.removejscssfile("bootstrap.min.css", "css") //remove all occurences "somestyle.css" on page
        } else {

            this.loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js", "js") //dynamically load and add this .js file
            this.loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css", "css") //dynamically load "javascript.php" as a JavaScript file
        }
        return (
            <Menu.Item key={key} className='customClass'>
                <Link
                    to={(currentTab && key === 'baseline_volume_planning') ? `/${this.props.app.currentTab}` : key === 'admin' ? '' : `/${key}`}>
                </Link>
                <LabeledIcon icon={icon} label={label} />
            </Menu.Item>

        );
    };

    render() {
        const { app } = this.props;

        return (
            <SiderWrapper>
                <Sider className='customSiderBar' width='72'
                       /*breakpoint='lg' collapsedWidth='0'*/ mode='dark'>
                    <Scrollbars>
                        <LabeledLogoIcon clearClickCB={this.clearClick} />
                        <Menu onClick={this.handleClick}
                            theme='dark'
                            className='customAntMenu'
                            selectedKeys={app.current}
                            onOpenChange={this.onOpenChange}>
                            {options.map(singleOption =>
                                this.getMenuItem({ singleOption })
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
    { changeOpenKeys, changeCurrent, linkClick }
)(Sidebar);