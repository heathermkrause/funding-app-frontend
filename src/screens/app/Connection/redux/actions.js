import * as CONSTANTS from './constants';

export function connectionListRequest(data) {
  return {
    type: CONSTANTS.CONNECTION_LIST_REQUEST,
    payload: data,
  };
}

export function connectionListSuccess(data, totalCount) {
  return {
    type: CONSTANTS.CONNECTION_LIST_SUCCESS,
    payload: {
      data,
      totalCount,
    },
  };
}

export function connectionListError(data) {
  return {
    type: CONSTANTS.CONNECTION_LIST_ERROR,
    data,
  };
}

export function connectionLoadRequest(id) {
  return {
    type: CONSTANTS.CONNECTION_LOAD_REQUEST,
    id,
  };
}

export function connectionLoadSuccess(data) {
  return {
    type: CONSTANTS.CONNECTION_LOAD_SUCCESS,
    data,
  };
}

export function connectionLoadError(data) {
  return {
    type: CONSTANTS.CONNECTION_LOAD_ERROR,
    data,
  };
}

export function connectionDeleteRequest(id) {
  return {
    type: CONSTANTS.CONNECTION_DELETE_REQUEST,
    id,
  };
}

export function connectionDeleteSuccess(id, data) {
  return {
    type: CONSTANTS.CONNECTION_DELETE_SUCCESS,
    id,
    data,
  };
}

export function connectionDeleteError(data) {
  return {
    type: CONSTANTS.CONNECTION_DELETE_ERROR,
    ...data,
  };
}

export function connectionSaveRequest(data) {
  return {
    type: CONSTANTS.CONNECTION_SAVE_REQUEST,
    data
  };
}

export function connectionSaveSuccess(data) {
  return {
    type: CONSTANTS.CONNECTION_SAVE_SUCCESS,
    data,
  };
}

export function connectionSaveError(data) {
  return {
    type: CONSTANTS.CONNECTION_SAVE_ERROR,
    data,
  };
}

export function loadNewConnection() {
  return {
    type: CONSTANTS.LOAD_NEW_CONNECTION,
  };
}

export function updateConnectionField(field, value) {
  return {
    type: CONSTANTS.UPDATE_CONNECTION_FIELD,
    field,
    value,
  };
}

export function connectionExportRequest() {
  return {
    type: CONSTANTS.CONNECTION_EXPORT_REQUEST
  };
}

export function connectionExportSuccess(data) {
  return {
    type: CONSTANTS.CONNECTION_EXPORT_SUCCESS,
    data
  };
}

export function connectionExportError() {
  return {
    type: CONSTANTS.CONNECTION_EXPORT_ERROR
  };

}
export function relatedStakeholderDeleteSuccess(id) {
  return {
    type: CONSTANTS.CONNECTION_RELATED_STAKEHOLDER_DELETE_SUCCESS,
    id
  };
}


