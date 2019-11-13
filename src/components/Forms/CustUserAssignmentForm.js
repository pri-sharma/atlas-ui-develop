import React, {Fragment} from 'react';
import SearchModal from '../SearchModal';


let levels = [];
// Create the options for customers
for (let i = 0; i < 9; i++) {
    levels.push(<option key={i}>{i}</option>)
}

class CustUserAssignmentForm extends React.Component {

    state = {
        user: '',
        level: '',
        product: '',
        valid_to: new Date(),
        valid_from: new Date()
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getCustomerForm = () => {
        return (
            <Fragment>
                <label>Level</label>
                <br/>
                <select
                    value=''
                    onChange={this.handleChange}
                    name="level">
                    {levels}
                </select>
                <div className="form-group">
                    <label htmlFor="exampleSelect1">Example select</label>
                    <select className="form-control" id="exampleSelect1">
                        <option>GB99</option>
                    </select>
                </div>
            </Fragment>
        )
    };


    render() {
        return (
            <Fragment>
                <SearchModal title="Customer Search" body={this.getCustomerForm}></SearchModal>
                <button type="button" className="btn btn-bold btn-label-brand btn-sm" data-toggle="modal" data-target="#search_modal">Launch Modal</button>
            </Fragment>

        );
    }
}

export default CustUserAssignmentForm;