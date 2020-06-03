import * as CONSTANTS from './constants';

export function stakeholderListRequest(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_LIST_REQUEST,
    payload: data,
  };
}

export function stakeholderListSuccess(data, totalCount) {
  return {
    type: CONSTANTS.STAKEHOLDER_LIST_SUCCESS,
    payload: {
      data,
      totalCount,
    },
  };
}

export function stakeholderListError(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_LIST_ERROR,
    data,
  };
}

export function stakeholderLoadRequest(id) {
  return {
    type: CONSTANTS.STAKEHOLDER_LOAD_REQUEST,
    id,
  };
}

export function stakeholderLoadSuccess(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_LOAD_SUCCESS,
    data,
  };
}

export function stakeholderLoadError(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_LOAD_ERROR,
    data,
  };
}

export function stakeholderDeleteRequest(id) {
  return {
    type: CONSTANTS.STAKEHOLDER_DELETE_REQUEST,
    id,
  };
}

export function stakeholderDeleteSuccess(id, data) {
  return {
    type: CONSTANTS.STAKEHOLDER_DELETE_SUCCESS,
    id,
    data,
  };
}

export function stakeholderDeleteError(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_DELETE_ERROR,
    ...data,
  };
}

export function stakeholderSaveRequest() {
  return {
    type: CONSTANTS.STAKEHOLDER_SAVE_REQUEST,
  };
}

export function stakeholderSaveSuccess(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_SAVE_SUCCESS,
    data,
  };
}

export function stakeholderSaveError(data) {
  return {
    type: CONSTANTS.STAKEHOLDER_SAVE_ERROR,
    data,
  };
}

export function loadNewStakeholder() {
  return {
    type: CONSTANTS.LOAD_NEW_STAKEHOLDER,
  };
}

export function updateStakeholderField(field, value) {
  return {
    type: CONSTANTS.UPDATE_STAKEHOLDER_FIELD,
    field,
    value,
  };
}
