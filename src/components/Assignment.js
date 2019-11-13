import React, {Component} from 'react'

class Assignment extends Component {

  render(){
    return(
          <h1 onClick={() => this.props.handleClick(this.props.assignment)}>
            {this.props.customer.description} -- {this.props.customer.customer_id}
          </h1>
      )
  }
}

export default Assignment
