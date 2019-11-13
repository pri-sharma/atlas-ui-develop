import React, {Component} from 'react';

class ExpandGridHeader extends Component {
    constructor(props) {
        super(props);

        //props.reactContainer.style.display = "inline-block";

        this.state = {
        };

        //props.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
    }


    render() {
        return (
            <div>
                <i className="fa fa-times"></i>
            </div>
        );
    }

    onSortChanged() {
        this.setState({
            ascSort: this.props.column.isSortAscending() ? 'active' : 'inactive',
            descSort: this.props.column.isSortDescending() ? 'active' : 'inactive',
            noSort: !this.props.column.isSortAscending() && !this.props.column.isSortDescending() ? 'active' : 'inactive'
        });
    }

    onMenuClick() {
        this.props.showColumnMenu(this.menuButton);
    }

    onSortRequested(order, event) {
        this.props.setSort(order, event.shiftKey);
    }
}

export default ExpandGridHeader;