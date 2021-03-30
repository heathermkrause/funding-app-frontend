import produce from 'immer';
import get from 'lodash/get';
import * as CONSTANTS from './constants';
import { cloneDeep, findIndex } from 'lodash';

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
        draft.project.id = action.payload.selected_project_id ? action.payload.selected_project_id : (action.payload.data.length ? action.payload.data[0]._id : '');
        draft.project.data = action.payload.data.find(item => {return item._id === draft.project.id});
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
        if(filteredList.length) {
          draft.project.id = filteredList[0]._id;
          draft.project.data = filteredList[0];
        }
        else {
          draft.project.id = '';
          draft.project.data = {};
        }

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
        if (draft.project.id === 'new') {
          draft.projects.list = [...draft.projects.list, action.data];
          draft.project.id = action.data._id;
          console.log('project save', action.data);
        } else {
          const projectArray = cloneDeep(state.projects.list);
          const index = findIndex(projectArray, { _id: action.data._id });
          projectArray[index] = action.data;
          draft.projects.list = projectArray;
        }
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
