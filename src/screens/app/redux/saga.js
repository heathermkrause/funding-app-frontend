import { all, fork } from 'redux-saga/effects';

import { userSaga } from '../User/redux/saga';
import { stakeholderSaga } from '../Stakeholder/redux/saga';
import { connectionSaga } from '../Connection/redux/saga';
import { projectSaga } from '../Project/redux/saga';
import { profileSaga } from '../Profile/redux/saga';

export function* appSaga() {
  yield all([
    fork(userSaga), 
    fork(stakeholderSaga),
    fork(connectionSaga),
    fork(projectSaga),
    fork(profileSaga)
  ]);
}
