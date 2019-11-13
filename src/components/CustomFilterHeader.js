import React, {Component, Fragment} from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';

class CustomFilterHeader extends Component {
    constructor(props) {
        super(props);
    }

    onMenuClicked() {
        this.props.showColumnMenu(this.menuButton);
    }

    render() {
        let menu = null;
        if (this.props.enableMenu) {
            menu =
                <div ref={(menuButton) => { this.menuButton = menuButton; }}
                     className="customHeaderMenuButton"
                     onClick={this.onMenuClicked.bind(this)}>
                    <i className="material-icons" style={{height: '40%', width: '40%', position: 'absolute', right: '0', top: '29%', left: '80%'}}>filter_list</i>
                </div>;
        }
        return (
            <div>
                <div className="customHeaderLabel">{this.props.displayName}</div>
                {menu}
            </div>
        );
    }

}

export default CustomFilterHeader;