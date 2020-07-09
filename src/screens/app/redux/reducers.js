import { combineReducers } from 'redux';

import { userReducer } from '../User/redux/reducers';
import { stakeholderReducer } from '../Stakeholder/redux/reducers';
import { connectionReducer } from '../Connection/redux/reducers';
import { projectReducer } from '../Project/redux/reducers';
import { profileReducer } from '../Profile/redux/reducers';

export const appReducer = combineReducers({
  userState: userReducer,
  stakeholderState: stakeholderReducer,
  connectionState: connectionReducer,
  projectState: projectReducer,
  profileState: profileReducer,
});
