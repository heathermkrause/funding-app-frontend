import { call, put, takeLatest, select } from 'redux-saga/effects';

import * as CONSTANTS from './constants';
import {
  profileLoadSuccess,
  profileLoadError,
  profileSaveSuccess,
  profileSaveError,
  profileDeleteSuccess,
  profileDeleteError,
} from './actions';
import { selectProfile } from './selectors';
import request from '../../../../utils/apiRequest';
import notify from '../../../../utils/notify';
import { history } from '../../../../configureStore';

export function* profileLoadRequest(action) {
  try {
    const data = yield call(request, `/profile/${action.id}`, 'GET', null, true);
    yield put(profileLoadSuccess(data));
  } catch (err) {
    yield put(profileLoadError(err));
  }
}

export function* profileDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `/profile/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(profileDeleteSuccess(action.id, data));
    notify('info', 'The user has been removed successfully!');
  } catch (err) {
    notify('error', 'An error occured in removing user.');
    yield put(profileDeleteError(err));
  }
}

export function* profileSaveRequest() {
  try {
    const state = yield select();
    const user = selectProfile(state);
    const requestData = user.user.data;
    const id = user.user.id;
    let responseData = null;

      responseData = yield call(
        request,
        `/profile/${id}`,
        'PUT',
        { ...requestData },
        true,
      );

    yield put(profileSaveSuccess(responseData));
    notify('success', 'User saved');
    history.push('/profile');
  } catch (err) {
    notify('error', err.message);
    yield put(profileSaveError(err));
  }
}

export function* profileSaga() {
  yield takeLatest(CONSTANTS.PROFILE_LOAD_REQUEST, profileLoadRequest);
  yield takeLatest(CONSTANTS.PROFILE_SAVE_REQUEST, profileSaveRequest);
  yield takeLatest(CONSTANTS.PROFILE_DELETE_REQUEST, profileDeleteRequest);
}
