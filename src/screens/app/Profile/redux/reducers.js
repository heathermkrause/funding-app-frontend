import produce from 'immer';
import * as CONSTANTS from './constants';

const newUser = {
  firstName: '',
  lastName: '',
  email: '',
};

const initalState = {
  users: {
    list: [],
    totalCount: 0,
    loading: false,
  },
  user: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
};

const profileReducer = (state = initalState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOAD_NEW_USER:
        draft.user = {
          data: newUser,
          id: 'new',
          error: [],
          loading: false,
        };
        break;
      case CONSTANTS.PROFILE_DELETE_REQUEST:
        draft.users.loading = true;
        draft.user.loading = true;
        break;
      case CONSTANTS.PROFILE_DELETE_SUCCESS:
        const userList = draft.users.list;
        const filteredList = userList.filter(user => user['_id'] !== action.id);
        draft.users.list = filteredList;
        draft.users.loading = false;
        draft.user.loading = false;
        break;
      case CONSTANTS.PROFILE_DELETE_ERROR:
        draft.users.loading = false;
        draft.user.loading = false;
        break;
      case CONSTANTS.PROFILE_LOAD_REQUEST:
        draft.user.loading = true;
        break;
      case CONSTANTS.PROFILE_LOAD_SUCCESS:
        draft.user.data = action.data;
        draft.user.id = action.data._id;
        draft.user.loading = false;
        break;
      case CONSTANTS.PROFILE_LOAD_ERROR:
        draft.user.loading = false;
        break;
      case CONSTANTS.PROFILE_SAVE_REQUEST:
        draft.user.data.loading = true;
        draft.user.error = [];
        break;
      case CONSTANTS.PROFILE_SAVE_SUCCESS:
        draft.user.id = action.data._id;
        draft.user.data.id = action.data._id;
        draft.user.loading = false;
        break;
      case CONSTANTS.PROFILE_SAVE_ERROR:
        draft.user.loading = false;
        draft.user.error = action.data.error;
        break;
      case CONSTANTS.UPDATE_PROFILE_FIELD:
        draft.user.data[action.field] = action.value;
        break;
      default:
        break;
    }
  });

export { profileReducer };
