import React, {Component, Fragment} from 'react';

class NavMenu extends Component {
    render() {
        return(
            <Fragment>
                <button className="kt-header-menu-wrapper-close" id="kt_header_menu_mobile_close_btn">
                    <i className="la la-close"></i>
                </button>
                <div className="kt-header-menu-wrapper" id="kt_header_menu_wrapper">
                    <div className="kt-header-menu kt-header-menu-mobile kt-header-menu--layout-tab" id="kt_header_menu">
                        <ul className="kt-menu__nav ">
                            <li className="kt-menu__item  kt-menu__item--active " aria-haspopup="true">
                                <a href="../../../public/index.html" className="kt-menu__link ">
                                    <span className="kt-menu__link-text">Dashboard</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default NavMenu