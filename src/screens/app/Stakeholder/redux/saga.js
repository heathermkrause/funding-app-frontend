import { call, put, takeLatest, select } from 'redux-saga/effects';
import get from 'lodash/get';

import * as CONSTANTS from './constants';
import {
  stakeholderListSuccess,
  stakeholderListError,
  stakeholderLoadSuccess,
  stakeholderLoadError,
  stakeholderSaveSuccess,
  stakeholderSaveError,
  stakeholderDeleteSuccess,
  stakeholderDeleteError  
} from './actions';
import {
  relatedStakeholderDeleteSuccess
} from '../../Connection/redux/actions';
import request from '../../../../utils/apiRequest';
import { history } from '../../../../configureStore';
import notify from '../../../../utils/notify';
import { selectStakeholder } from './selectors';
import { selectProject } from '../../Project/redux/selectors';

export function* stakeholderListRequest(action) {
  try {
    const state = yield select();
    const project = selectProject(state);
    const projectId = get(project, 'project.id');

    if(!projectId)
      return;

    const { list } = yield call(
      request,
      `/stakeholders/${projectId}`,
      'GET',
      null,
      true,
    );

    yield put(stakeholderListSuccess(list));
    history.push(`/`);
  } catch (err) {
    yield put(stakeholderListError(err));
  }
}

export function* stakeholderLoadRequest(action) {
  try {
    const state = yield select();
    const project = selectProject(state);
    const projectId = get(project, 'project.id');

    const data = yield call(
        request,
        `/stakeholders/${projectId}/${action.id}`,
        'GET',
        null,
        true,
    );

    yield put(stakeholderLoadSuccess(data));
  } catch (err) {
    yield put(stakeholderLoadError(err));
  }
}

export function* stakeholderDeleteRequest(action) {
  try {
    const state = yield select();
    const project = selectProject(state);
    const projectId = get(project, 'project.id');

    const data = yield call(
        request,
        `/stakeholders/${projectId}/${action.id}`,
        'DELETE',
        null,
        true,
    );
    yield put(relatedStakeholderDeleteSuccess(action.id));
    yield put(stakeholderDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(stakeholderDeleteError(err));
  }
}

export function* stakeholderSaveRequest() {
  const state = yield select();
  const project =  selectProject(state);
  const projectId = get(project, 'project.id');
  if(!projectId) {
    return notify('warn', 'Please select or create a project!')  
  }

  try {    
    const stakeholder = selectStakeholder(state);
    const requestData = get(stakeholder, 'stakeholder.data');
    const id = get(stakeholder, 'stakeholder.id');
    let responseData = null;
    
    if (id === 'new') {
        responseData = yield call(
            request,
            `/stakeholders/${projectId}`,
            'POST',
            { ...requestData },
            true,
        );
    } else {
      responseData = yield call(
        request,
        `/stakeholders/${projectId}/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }
    
    history.push('/');
    notify('success', 'The stakeholder has been saved succcessfully');

    yield put(stakeholderSaveSuccess(responseData));
  } catch (err) {
    notify('error', 'Failed to save the stakeholder, try again!');
    yield put(stakeholderSaveError(err));
  }
}

export function* stakeholderSaga() {
  yield takeLatest(CONSTANTS.STAKEHOLDER_LIST_REQUEST, stakeholderListRequest);
  yield takeLatest(CONSTANTS.STAKEHOLDER_LOAD_REQUEST, stakeholderLoadRequest);
  yield takeLatest(CONSTANTS.STAKEHOLDER_SAVE_REQUEST, stakeholderSaveRequest);
  yield takeLatest(CONSTANTS.STAKEHOLDER_DELETE_REQUEST, stakeholderDeleteRequest);
}
