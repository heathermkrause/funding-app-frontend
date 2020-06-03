import produce from 'immer';
import get from 'lodash/get';
import * as CONSTANTS from './constants';

const newProject = {
  date: new Date(),
};

const initalState = {
  projects: {
    list: [],
    totalCount: 0,
    loading: false,
  },
  project: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
};

const projectReducer = (state = initalState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOAD_NEW_PROJECT:
        draft.project = {
          id: 'new',
          data: newProject,
          error: [],
          loading: false,
        };
        break;
      case CONSTANTS.PROJECT_LIST_REQUEST:
        draft.projects.loading = true;
        break;
      case CONSTANTS.PROJECT_LIST_SUCCESS:
        draft.projects.list = action.payload.data;
        draft.projects.totalCount = action.payload.totalCount;
        draft.projects.loading = false;
        break;
      case CONSTANTS.PROJECT_LIST_ERROR:
        draft.projects.loading = false;
        break;
      case CONSTANTS.PROJECT_DELETE_REQUEST:
        draft.projects.loading = true;
        draft.project.loading = true;
        break;
      case CONSTANTS.PROJECT_DELETE_SUCCESS:
        const projectList = get(state, ['projects', 'list']);
        const filteredList = projectList.filter(
          project => project['_id'] !== action.id,
        );
        draft.projects.list = filteredList;
        draft.projects.loading = false;
        draft.project.loading = false;
        break;
      case CONSTANTS.PROJECT_DELETE_ERROR:
        draft.project.loading = false;
        draft.projects.loading = false;
        break;
      case CONSTANTS.PROJECT_LOAD_REQUEST:
        draft.project.loading = true;
        break;
      case CONSTANTS.PROJECT_LOAD_SUCCESS:
        draft.project.data = action.data;
        draft.project.id = action.data._id;
        draft.project.loading = false;
        break;
      case CONSTANTS.PROJECT_LOAD_ERROR:
        draft.project.loading = false;
        break;
      case CONSTANTS.PROJECT_SAVE_REQUEST:
        draft.project.loading = true;
        draft.project.error = [];
        break;
      case CONSTANTS.PROJECT_SAVE_SUCCESS:
        draft.projects.list[0] = action.data;
        draft.project.data = action.data;
        draft.project.loading = false;
        break;
      case CONSTANTS.PROJECT_SAVE_ERROR:
        draft.project.loading = false;
        draft.project.error = action.data.error;
        break;
      case CONSTANTS.UPDATE_PROJECT_FIELD:
        draft.project.data[action.field] = action.value;
        break;
      default:
        break;
    }
  });

export { projectReducer };
