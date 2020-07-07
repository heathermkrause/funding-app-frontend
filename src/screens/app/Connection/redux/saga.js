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
import { selectProject } from '../../Project/redux/selectors';

export function* connectionListRequest(action) {
  try {
    const state = yield select();
    const project = selectProject(state);
    const projectId = get(project, 'project.id');
    const { list } = yield call(
      request,
      `/connections/${projectId}`,
      'GET',
      null,
      true,
    );

    yield put(connectionListSuccess(list));
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
        const state = yield select();
        const project = selectProject(state);
        const projectId = get(project, 'project.id');
        const data = yield call(
            request,
            `/connections/${projectId}/${action.id}`,
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
  const state = yield select();
  const project = selectProject(state);
  const projectId = get(project, 'project.id');
  if (!projectId) {
    return notify('warn', 'Please select or create a project!');
  }

  try {
    let responseData = {...data.data};

    if (responseData._id.includes('new')) {
      delete responseData._id;
      responseData = yield call(
        request,
        `/connections/${projectId}`,
        'POST',
        { ...responseData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `/connections/${projectId}/${responseData._id}`,
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

export function* connectionExportRequest(action) {
  try {
    const data = yield call(
      request,
      '/csv/export',
      'GET',
      {project_id: action.project_id},
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
