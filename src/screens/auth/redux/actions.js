import * as CONSTANTS from './constants';

export const loginRequest = (email, password) => {
  return {
    type: CONSTANTS.LOGIN_REQUEST,
    email,
    password,
  };
};

export const loginSuccess = data => {
  return {
    type: CONSTANTS.LOGIN_SUCCESS,
    payload: data,
  };
};

export const loginError = () => {
  return {
    type: CONSTANTS.LOGIN_ERROR,
  };
};

export const signupRequest = data => {
  return {
    type: CONSTANTS.SIGNUP_REQUEST,
    data,
  };
};

export const signupSuccess = data => {
  return {
    type: CONSTANTS.SIGNUP_SUCCESS,
    payload: data,
  };
};

export const signupError = () => {
  return {
    type: CONSTANTS.SIGNUP_ERROR,
  };
};

export const forgotPasswordRequest = (email) => {
  return {
    type: CONSTANTS.FORGOTPASSWORD_REQUEST,
    email,
  };
};

export const forgotPasswordSuccess = data => {
  return {
    type: CONSTANTS.FORGOTPASSWORD_SUCCESS,
    payload: data,
  };
};

export const forgotPasswordError = () => {
  return {
    type: CONSTANTS.FORGOTPASSWORD_ERROR,
  };
};

export const resetPasswordRequest = (data) => {
  return {
    type: CONSTANTS.RESETPASSWORD_REQUEST,
    data,
  };
};

export const resetPasswordSuccess = data => {
  return {
    type: CONSTANTS.RESETPASSWORD_SUCCESS,
    payload: data,
  };
};

export const resetPasswordError = () => {
  return {
    type: CONSTANTS.RESETPASSWORD_ERROR,
  };
};

export const logout = () => {
  return {
    type: CONSTANTS.LOGOUT,
  };
};
