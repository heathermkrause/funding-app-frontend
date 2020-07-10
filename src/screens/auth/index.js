import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { LoginPage } from './Login';
import { SignupPage } from './Signup';
import { ForgotPasswordPage } from './ForgotPassword';
import { ResetPasswordPage } from './ResetPassword';

const AuthRouter = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/login`} component={LoginPage} />
    <Route exact path={`${match.url}/signup`} component={SignupPage} />
    <Route exact path={`${match.url}/forgot-password`} component={ForgotPasswordPage} />
    <Route exact path={`${match.url}/reset-password`} component={ResetPasswordPage} />
    <Redirect to={`${match.url}/login`} />
  </Switch>
);

export const AuthScreens = withRouter(AuthRouter);
