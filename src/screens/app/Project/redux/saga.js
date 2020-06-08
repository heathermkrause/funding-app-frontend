import { call, put, takeLatest, select } from 'redux-saga/effects';
import get from 'lodash/get';

import * as CONSTANTS from './constants';
import {
  projectListSuccess,
  projectListError,
  projectLoadSuccess,
  projectLoadError,
  projectSaveSuccess,
  projectSaveError,
  projectDeleteSuccess,
  projectDeleteError,
} from './actions';
import {
  stakeholderListRequest
} from '../../Stakeholder/redux/actions';
import {
  connectionListRequest
} from '../../Connection/redux/actions';
import request from '../../../../utils/apiRequest';
import { history } from '../../../../configureStore';
import notify from '../../../../utils/notify';
import { selectProject } from './selectors';

export function* projectListRequest(action) {
  try {
    const { list } = yield call(
      request,
      '/projects',
      'GET',
      null,
      true,
    );

    yield put(projectListSuccess(list));
    yield put(stakeholderListRequest());
    yield put(connectionListRequest());
    history.push(`/`);
  } catch (err) {
    yield put(projectListError(err));
  }
}

export function* projectLoadRequest(action) {
  try {
    const data = yield call(
      request,
      `/projects/${action.id}`,
      'GET',
      null,
      true,
    );

    yield put(projectLoadSuccess(data));
    yield put(stakeholderListRequest());
    yield put(connectionListRequest());
  } catch (err) {
    yield put(projectLoadError(err));
  }
}

export function* projectDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `/projects/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(projectDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(projectDeleteError(err));
  }
}

export function* projectSaveRequest() {
  try {
    const state = yield select();
    const project = selectProject(state);
    const requestData = get(project, 'project.data');
    const id = get(project, 'project.id');
    let responseData = null;    

    if (id === 'new') {
      responseData = yield call(
        request,
        '/projects',
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `/projects/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }
    history.push('/');
    notify('success', 'The project has been saved succcessfully');

    yield put(projectSaveSuccess(responseData));
  } catch (err) {
    notify('error', 'Failed to save the project, try again!');
    yield put(projectSaveError(err));
  }
}

export function* projectSaga() {
  yield takeLatest(CONSTANTS.PROJECT_LIST_REQUEST, projectListRequest);
  yield takeLatest(CONSTANTS.PROJECT_LOAD_REQUEST, projectLoadRequest);
  yield takeLatest(CONSTANTS.PROJECT_SAVE_REQUEST, projectSaveRequest);
  yield takeLatest(
    CONSTANTS.PROJECT_DELETE_REQUEST,
    projectDeleteRequest,
  );
}
