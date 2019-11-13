import React, {Component} from 'react';
import NavMenu from '../components/NavComponents/NavMenu'
import UserBar from '../components/NavComponents/UserBar'

class Navbar extends Component {
    render() {
        return(
            <div id="kt_header" className="kt-header kt-grid__item kt-header--fixed">
                <NavMenu/>
                <UserBar/>
            </div>

        )
    }
}

export default Navbar;