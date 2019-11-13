import React from 'react';

class SearchModal extends React.Component {

    state = {
        user: '',
        level: '',
        valid_to: new Date(),
        valid_from: new Date()
    };


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <div className="modal fade" id="search_modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true"
                 style={{display: 'none'}} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchModal;