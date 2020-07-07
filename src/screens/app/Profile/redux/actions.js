import * as CONSTANTS from './constants';

export function profileLoadRequest(id) {
  return {
    type: CONSTANTS.PROFILE_LOAD_REQUEST,
    id,
  };
}

export function profileLoadSuccess(data) {
  return {
    type: CONSTANTS.PROFILE_LOAD_SUCCESS,
    data,
  };
}

export function profileLoadError(data) {
  return {
    type: CONSTANTS.PROFILE_LOAD_ERROR,
    data,
  };
}

export function profileDeleteRequest(id) {
  return {
    type: CONSTANTS.PROFILE_DELETE_REQUEST,
    id,
  };
}

export function profileDeleteSuccess(id, data) {
  return {
    type: CONSTANTS.PROFILE_DELETE_SUCCESS,
    id,
    data,
  };
}

export function profileDeleteError(data) {
  return {
    type: CONSTANTS.PROFILE_DELETE_ERROR,
    ...data,
  };
}

export function profileSaveRequest(data) {
  return {
    type: CONSTANTS.PROFILE_SAVE_REQUEST,
    data,
  };
}

export function profileSaveSuccess(data) {
  return {
    type: CONSTANTS.PROFILE_SAVE_SUCCESS,
    data,
  };
}

export function profileSaveError(data) {
  return {
    type: CONSTANTS.PROFILE_SAVE_ERROR,
    data,
  };
}

export function loadNewUser() {
  return {
    type: CONSTANTS.LOAD_NEW_USER,
  };
}

export function updateProfileField(field, value) {
  return {
    type: CONSTANTS.UPDATE_PROFILE_FIELD,
    field,
    value,
  };
}
