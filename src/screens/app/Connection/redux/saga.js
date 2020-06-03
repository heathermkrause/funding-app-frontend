import { call, put, takeLatest, select } from 'redux-saga/effects';
import get from 'lodash/get';

import * as CONSTANTS from './constants';
import {
  connectionListSuccess,
  connectionListError,
  connectionLoadSuccess,
  connectionLoadError,
  connectionSaveSuccess,
  connectionSaveError,
  connectionDeleteSuccess,
  connectionDeleteError,
  connectionExportSuccess,
  connectionExportError
} from './actions';
import request from '../../../../utils/apiRequest';
import { history } from '../../../../configureStore';
import notify from '../../../../utils/notify';
import { selectConnection, selectProject } from './selectors';

export function* connectionListRequest(action) {
  try {
    const { list, totalCount } = yield call(
      request,
      '/connections',
      'GET',
      null,
      true,
    );

    yield put(connectionListSuccess(list, totalCount));
    history.push(`/`);
  } catch (err) {
    yield put(connectionListError(err));
  }
}

export function* connectionLoadRequest(action) {
  try {
    const data = yield call(
      request,
      `/connections/${action.id}`,
      'GET',
      null,
      true,
    );

    yield put(connectionLoadSuccess(data));
  } catch (err) {
    yield put(connectionLoadError(err));
  }
}

export function* connectionDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `/connections/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(connectionDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(connectionDeleteError(err));
  }
}

export function* connectionSaveRequest(data) {
  try {
    let responseData = {...data.data};

    if (responseData._id.includes('new')) {
      delete responseData._id;
      responseData = yield call(
        request,
        '/connections',
        'POST',
        { ...responseData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `/connections/${responseData._id}`,
        'PUT',
        { ...responseData },
        true,
      );
    }
    history.push('/');
    notify('success', 'The connection has been saved succcessfully');

    yield put(connectionSaveSuccess(responseData));
  } catch (err) {
    console.log(err)
    notify('error', 'Failed to save the connection, try again!');
    yield put(connectionSaveError(err));
  }
}

export function* connectionExportRequest() {
  try {
    const data = yield call(
      request,
      '/csv/export',
      'GET',
      null,
      true
    );
    notify('success', 'The connection has been exported succcessfully');
    console.log('888:',data)
    yield put(connectionExportSuccess(data));
  } catch (err) {
    yield put(connectionExportError(err));
  }
}

export function* connectionSaga() {
  yield takeLatest(CONSTANTS.CONNECTION_LIST_REQUEST, connectionListRequest);
  yield takeLatest(CONSTANTS.CONNECTION_LOAD_REQUEST, connectionLoadRequest);
  yield takeLatest(CONSTANTS.CONNECTION_SAVE_REQUEST, connectionSaveRequest);
  yield takeLatest(
    CONSTANTS.CONNECTION_DELETE_REQUEST,
    connectionDeleteRequest,
    );
  yield takeLatest(CONSTANTS.CONNECTION_EXPORT_REQUEST, connectionExportRequest);
}
