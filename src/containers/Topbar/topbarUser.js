import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Popover from '../../components/uielements/popover';
import IntlMessages from '../../components/utility/intlMessages';
// import userpic from '../../image/user1.png';
import TopbarDropdownWrapper from './topbarDropdown.style';
import { store } from '../../redux/store'

import { logout } from "../../redux/auth/actions";

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <Link className="isoDropdownLink" to="/user/settings">
            Settings
        </Link>
        <a className="isoDropdownLink" href="# ">
          <IntlMessages id="sidebar.feedback" />
        </a>
        <a className="isoDropdownLink" href="# ">
          <IntlMessages id="topbar.help" />
        </a>
        <a className="isoDropdownLink" onClick={this.props.logout} href="# ">
          <IntlMessages id="topbar.logout" />
        </a>
      </TopbarDropdownWrapper>
    );
    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
          <img alt="user" src={this.props.Auth.photoURL} style={{width: '1.5rem', borderRadius: '50%', margin: '.5rem', userSelect: 'none'}}/>
          <span className="userActivity online" />
      </Popover>
    );
  }
}

const mapStateToProps= (state) => {
    return { ...state }  // Take it all
};

export default connect(
  mapStateToProps,
  { logout }
)(TopbarUser);
