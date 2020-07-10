import { put, takeLatest, call } from 'redux-saga/effects';
import * as CONSTANTS from './constants';

import {
  signupError,
  signupSuccess,
  loginError,
  loginSuccess,
  forgotPasswordError,
  forgotPasswordSuccess,
  resetPasswordError,
  resetPasswordSuccess
} from './actions';

import { history } from '../../../configureStore';
import request from '../../../utils/apiRequest';
import notify from '../../../utils/notify';

function* signup(action) {
  try {
    const data = yield call(
      request,
      '/auth/signup',
      'POST',
      action.data,
      false,
    );

    yield put(signupSuccess(data));
    notify('success', 'Successfully registered');
    history.push('/auth/login');
  } catch (err) {
    notify('error', err.message);
    yield put(signupError());
  }
}

function* signin(action) {
  try {
    const requestData = {
      email: action.email,
      password: action.password,
    };
    const data = yield call(request, '/auth/login', 'POST', requestData, false);
    yield put(loginSuccess(data));
    notify('success', 'You are successfully logged in!');
    history.push('/');
  } catch (err) {
    notify('error', err.message);
    yield put(loginError());
  }
}

function* forgotPassword(action) {
  const requestData = {
    email: action.email,
  };
  try {
    const data = yield call(
      request,
      '/auth/forgotpassword',
      'POST',
      requestData,
      false,
    );

    yield put(forgotPasswordSuccess(data));
    notify('success', 'Password Recovery Email is sent!');
    history.push('/auth/login');
  } catch (err) {
    notify('error', err.message);
    yield put(forgotPasswordError());
  }
}

function* resetPassword(action) {
  try {
    const data = yield call(
      request,
      '/auth/resetpassword',
      'POST',
      action.data,
      false,
    );

    yield put(resetPasswordSuccess(data));
    notify('success', 'Password is reset!');
    history.push('/auth/login');
  } catch (err) {
    notify('error', err.message);
    yield put(resetPasswordError());
  }
}


export function* authSaga() {
  yield takeLatest(CONSTANTS.SIGNUP_REQUEST, signup);
  yield takeLatest(CONSTANTS.LOGIN_REQUEST, signin);
  yield takeLatest(CONSTANTS.FORGOTPASSWORD_REQUEST, forgotPassword);
  yield takeLatest(CONSTANTS.RESETPASSWORD_REQUEST, resetPassword);
}
