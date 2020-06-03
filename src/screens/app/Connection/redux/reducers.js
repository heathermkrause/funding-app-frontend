import produce from 'immer';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import * as CONSTANTS from './constants';
import fileDownload from 'js-file-download';

const newConnection = {
  date: new Date(),
};

const initalState = {
  connections: {
    list: [],
    totalCount: 0,
    loading: false,
  },
  connection: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
};

const connectionReducer = (state = initalState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOAD_NEW_CONNECTION:
        draft.connection = {
          id: 'new',
          data: newConnection,
          error: [],
          loading: false,
        };
        break;
      case CONSTANTS.CONNECTION_LIST_REQUEST:
        draft.connections.loading = true;
        break;
      case CONSTANTS.CONNECTION_LIST_SUCCESS:
        draft.connections.list = action.payload.data;
        draft.connections.totalCount = action.payload.totalCount;
        draft.connections.loading = false;
        break;
      case CONSTANTS.CONNECTION_LIST_ERROR:
        draft.connections.loading = false;
        break;
      case CONSTANTS.CONNECTION_DELETE_REQUEST:
        draft.connections.loading = true;
        draft.connection.loading = true;
        break;
      case CONSTANTS.CONNECTION_DELETE_SUCCESS:
        const connectionList = get(state, ['connections', 'list']);
        const filteredList = connectionList.filter(
          connection => connection['_id'] !== action.id,
        );
        draft.connections.list = filteredList;
        draft.connections.loading = false;
        draft.connection.loading = false;
        break;
      case CONSTANTS.CONNECTION_DELETE_ERROR:
        draft.connection.loading = false;
        draft.connections.loading = false;
        break;
      case CONSTANTS.CONNECTION_LOAD_REQUEST:
        draft.connection.loading = true;
        break;
      case CONSTANTS.CONNECTION_LOAD_SUCCESS:
        draft.connection.data = action.data;
        draft.connection.id = action.data._id;
        draft.connection.loading = false;
        break;
      case CONSTANTS.CONNECTION_LOAD_ERROR:
        draft.connection.loading = false;
        break;
      case CONSTANTS.CONNECTION_SAVE_REQUEST:
        draft.connection.loading = true;
        draft.connection.data = action.data;
        draft.connection.error = [];
        break;
      case CONSTANTS.CONNECTION_SAVE_SUCCESS:

        const connectionArray = cloneDeep(state.connections.list);
         
        const index = findIndex(connectionArray, { _id: action.data._id });
        if(index >= 0) {
          connectionArray[index] = action.data;
        } else {
          connectionArray.push(action.data);
        }
        draft.connections.list = connectionArray;
        draft.connection.loading = false;
        break;
      case CONSTANTS.CONNECTION_SAVE_ERROR:
        draft.connection.loading = false;
        draft.connection.error = action.data.error;
        break;
      case CONSTANTS.UPDATE_CONNECTION_FIELD:
        draft.connection.data[action.field] = action.value;
        break;
      case CONSTANTS.CONNECTION_EXPORT_SUCCESS:
        draft.connection.loading = false;
        fileDownload(action.data.data, `output-${Date.now()}.csv`);
        break;
      case CONSTANTS.CONNECTION_EXPORT_ERROR:
        draft.connection.loading = false;
        break;
      case CONSTANTS.CONNECTION_RELATED_STAKEHOLDER_DELETE_SUCCESS:
        const connections = get(state, ['connections', 'list']);
        const filteredConnections = connections.filter(
          connection => (connection.from._id !== action.id || connection.to._id !== action.id),
        );
        draft.connections.list = filteredConnections;
        draft.connections.loading = false;
        draft.connection.loading = false;
        break;
      default:
        break;
    }
  });

export { connectionReducer };
