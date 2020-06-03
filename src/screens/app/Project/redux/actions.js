import * as CONSTANTS from './constants';

export function projectListRequest(data) {
  return {
    type: CONSTANTS.PROJECT_LIST_REQUEST,
    payload: data,
  };
}

export function projectListSuccess(data, totalCount) {
  return {
    type: CONSTANTS.PROJECT_LIST_SUCCESS,
    payload: {
      data,
      totalCount,
    },
  };
}

export function projectListError(data) {
  return {
    type: CONSTANTS.PROJECT_LIST_ERROR,
    data,
  };
}

export function projectLoadRequest(id) {
  return {
    type: CONSTANTS.PROJECT_LOAD_REQUEST,
    id,
  };
}

export function projectLoadSuccess(data) {
  return {
    type: CONSTANTS.PROJECT_LOAD_SUCCESS,
    data,
  };
}

export function projectLoadError(data) {
  return {
    type: CONSTANTS.PROJECT_LOAD_ERROR,
    data,
  };
}

export function projectDeleteRequest(id) {
  return {
    type: CONSTANTS.PROJECT_DELETE_REQUEST,
    id,
  };
}

export function projectDeleteSuccess(id, data) {
  return {
    type: CONSTANTS.PROJECT_DELETE_SUCCESS,
    id,
    data,
  };
}

export function projectDeleteError(data) {
  return {
    type: CONSTANTS.PROJECT_DELETE_ERROR,
    ...data,
  };
}

export function projectSaveRequest(data) {
  return {
    type: CONSTANTS.PROJECT_SAVE_REQUEST,
    data
  };
}

export function projectSaveSuccess(data) {
  return {
    type: CONSTANTS.PROJECT_SAVE_SUCCESS,
    data,
  };
}

export function projectSaveError(data) {
  return {
    type: CONSTANTS.PROJECT_SAVE_ERROR,
    data,
  };
}

export function loadNewProject() {
  return {
    type: CONSTANTS.LOAD_NEW_PROJECT,
  };
}

export function updateProjectField(field, value) {
  return {
    type: CONSTANTS.UPDATE_PROJECT_FIELD,
    field,
    value,
  };
}
