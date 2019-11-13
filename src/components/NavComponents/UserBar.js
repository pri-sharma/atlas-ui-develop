import React, {Component} from "react";

class UserBar extends Component{
    render() {
        return(
            <div className="kt-header__topbar">
                <div className="kt-header__topbar-item kt-header__topbar-item--user">
                    <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="0px,0px" aria-expanded="false">
                        <div className="kt-header__topbar-user">
                            <span className="kt-header__topbar-welcome kt-hidden-mobile">Hello User!</span>
                            {/*<span className="kt-hidden kt-header__topbar-username kt-hidden-mobile">User!</span>*/}
                            <img alt="Pic" src={this.props.photoURL}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserBar