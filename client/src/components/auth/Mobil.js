import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import { mobil, twitter, resetErrors } from '../../actions';
import {
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Typography
} from '@material-ui/core';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import withRoot from '../../withRoot';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    marginTop: 30,
    marginBottom: 10
  },
  card: {
    minWidth: 350,
    padding: 20
  }
});

const renderTextField = ({ input, label, type }) => (
  <TextField
    label={label}
    placeholder={label}
    type={type}
    fullWidth
    {...input}
    margin="normal"
  />
);

class Mobil extends Component {
  componentWillMount() {
    this.props.resetErrors();
  }

  submitFormHandler = ({ email, password }) => {
    this.props.mobil(email, password, this.props.history);
  };

  renderAlert() {
    if (this.props.error) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.error}
        </div>
      );
    }
  }
  render() {
    const { classes, handleSubmit, pristine, submitting } = this.props;
    return (
      <div>
        <Grid className={classes.root} container justify="center">
          <Card className={classes.card}>
            <div>{this.renderAlert()}</div>
            <div>
              <Button
                className={classes.button}
                variant="raised"
                color="secondary"
                fullWidth
                href="https://labpicme.herokuapp.com/api/users/auth/twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
                Login with twitter
              </Button>
            </div>
            <div>
              <form onSubmit={handleSubmit(this.submitFormHandler)}>
                <div>
                  <Field
                    name="email"
                    label="email"
                    component={renderTextField}
                  />
                </div>
                <div>
                  <Field
                    name="password"
                    label="password"
                    type="password"
                    component={renderTextField}
                  />
                </div>
                <div>
                  <Button
                    className={classes.button}
                    variant="raised"
                    size="large"
                    type="submit"
                    fullWidth
                    disabled={pristine || submitting}
                  >
                    Log in
                  </Button>
                </div>
              </form>
            </div>
            <CardContent>
              <Link to="/signup">
                <Typography variant="body1" gutterBottom>
                  Don't have an account? Sign up
                </Typography>
              </Link>

              <Link to="/forgotpassword">
                <Typography variant="body1" gutterBottom>
                  Forgot password?
                </Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.authenticated,
    error: state.auth.error
  };
};

Mobil.propTypes = {
  classes: PropTypes.object.isRequired
};

Mobil = connect(
  mapStateToProps,
  {
    mobil,
    twitter,
    resetErrors
  }
)(Mobil);

const MobilWrapped = withRoot(withStyles(styles)(Mobil));

export default reduxForm({
  form: 'login',
  fields: ['email', 'password']
})(MobilWrapped);