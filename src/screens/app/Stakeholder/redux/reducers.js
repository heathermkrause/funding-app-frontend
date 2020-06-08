import produce from 'immer';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import * as CONSTANTS from './constants';

const newStakeholder = {
  date: new Date(),
};

const initalState = {
  stakeholders: {
    list: [],
    totalCount: 0,
    loading: false,
  },
  stakeholder: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
};

const stakeholderReducer = (state = initalState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOAD_NEW_STAKEHOLDER:
        draft.stakeholder = {
          id: 'new',
          data: newStakeholder,
          error: [],
          loading: false,
        };
        break;
      case CONSTANTS.STAKEHOLDER_LIST_REQUEST:
        draft.stakeholders.loading = true;
        break;
      case CONSTANTS.STAKEHOLDER_LIST_SUCCESS:
        draft.stakeholders.list = action.payload.data;
        draft.stakeholders.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_LIST_ERROR:
        draft.stakeholders.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_DELETE_REQUEST:
        draft.stakeholders.loading = true;
        draft.stakeholder.loading = true;
        break;
      case CONSTANTS.STAKEHOLDER_DELETE_SUCCESS:
        const stakeholderList = get(state, ['stakeholders', 'list']);
        const filteredList = stakeholderList.filter(
          stakeholder => stakeholder['_id'] !== action.id,
          );
        draft.stakeholders.list = filteredList;
        draft.stakeholders.loading = false;
        draft.stakeholder.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_DELETE_ERROR:
        draft.stakeholder.loading = false;
        draft.stakeholders.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_LOAD_REQUEST:
        draft.stakeholder.loading = true;
        break;
      case CONSTANTS.STAKEHOLDER_LOAD_SUCCESS:
        draft.stakeholder.data = action.data;
        draft.stakeholder.id = action.data._id;
        draft.stakeholder.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_LOAD_ERROR:
        draft.stakeholder.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_SAVE_REQUEST:
        draft.stakeholder.loading = true;
        draft.stakeholder.error = [];
        break;
      case CONSTANTS.STAKEHOLDER_SAVE_SUCCESS:
        if (draft.stakeholder.id !== 'new') {
          const index = findIndex(draft.stakeholders.list, {_id: action.data._id});
          draft.stakeholders.list[index] = action.data;
        } else {
          draft.stakeholders.list = [...draft.stakeholders.list, action.data];
        }
        draft.stakeholder.loading = false;
        break;
      case CONSTANTS.STAKEHOLDER_SAVE_ERROR:
        draft.stakeholder.loading = false;
        draft.stakeholder.error = action.data.error;
        break;
      case CONSTANTS.UPDATE_STAKEHOLDER_FIELD:
        draft.stakeholder.data[action.field] = action.value;
        break;
      default:
        break;
    }
  });

export { stakeholderReducer };
