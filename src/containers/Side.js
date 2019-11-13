import React, {Component, Fragment} from 'react';
import SideHeader from "../components/SideComponents/SideHeader";
import SideMenu from '../components/SideComponents/SideMenu'


class Side extends Component {
    render(){
        return(
            <Fragment>
                <button className="kt-aside-close " id="kt_aside_close_btn">
                    <i className="la la-close"></i>
                </button>
                <div className="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop" id="kt_aside">
                    <SideHeader/>
                    <SideMenu/>
                </div>
            </Fragment>

        )
    }
}

export default Side