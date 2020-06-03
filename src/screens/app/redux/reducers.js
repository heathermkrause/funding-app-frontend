import { combineReducers } from 'redux';

import { userReducer } from '../User/redux/reducers';
import { reviewReducer } from '../Review/redux/reducers';
import { restaurantReducer } from '../Restaurant/redux/reducers';
import { stakeholderReducer } from '../Stakeholder/redux/reducers';
import { connectionReducer } from '../Connection/redux/reducers';
import { projectReducer } from '../Project/redux/reducers';

export const appReducer = combineReducers({
  userState: userReducer,
  reviewState: reviewReducer,
  restaurantState: restaurantReducer,
  stakeholderState: stakeholderReducer,
  connectionState: connectionReducer,
  projectState: projectReducer
});
