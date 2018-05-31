import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { account } from "../actions";
// import Bread from "./Bread";

class Account extends Component {
	componentWillMount() {
		console.log('auth', this.props.authenticated);
	}

  accountFormHandler = ({
    email,
    password, 
    // newPassword, 
    // confirmPassword
  }) => {
    this.props.account(
      email,
      password, 
      // TO DO: add newPassword/confirmPassword field
      // newPassword, 
      // confirmPassword
    );
  };

  renderAlert() {
    if (this.props.error) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.error}
        </div>
      )
    }
  }
  render() {
    return (
      <div className="Account">
        {this.renderAlert()}
        <form onSubmit={this.props.handleSubmit(this.accountFormHandler)}>
        <div className="form-group col-md-6">
          <label>email</label>
          <Field
            className="form-control"
            name="email"
            component="input"
            type="text"
          />
        </div>
        
        <div className="form-group col-md-6">
          <label>password</label>
          <Field
            className="form-control"
            name="password"
            component="input"
            type="password"
          />
        </div>

        {/* <div className="form-group col-md-6">
          <label>New password</label>
          <Field
            className="form-control"
            name="newPassword"
            component="input"
            type="password"
          />
        </div>

        <div className="form-group col-md-6">
          <label>Confirm new password</label>
          <Field
            className="form-control"
            name="confirmPassword"
            component="input"
            type="password"
          />
        </div> */}

        <div className="form-group col-md-6">
          <button action="submit" className="btn btn-primary">Update</button>  
        </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  error: state.auth.error
});

Account = connect(mapStateToProps, {
  account
})(Account);

export default reduxForm({
  form: "account", 
  fields: [
    "email",
    "password",
    // "newPassword",
    // "confirmPassword",
  ]
})(Account);