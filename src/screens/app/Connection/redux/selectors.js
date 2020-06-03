import { createSelector } from 'reselect';
import get from 'lodash/get';

const selectConnection = state => get(state, 'app.connectionState');

const makeSelectConnectionList = () =>
  createSelector(selectConnection, connectionState =>
    get(connectionState, ['connections', 'list']),
  );

const makeSelectConnectionListLoading = () =>
  createSelector(selectConnection, connectionState =>
    get(connectionState, ['connections', 'loading']),
  );

const makeSelectConnection = () =>
  createSelector(selectConnection, connectionState =>
    get(connectionState, ['connection', 'data']),
  );

const makeSelectConnectionLoading = () =>
  createSelector(selectConnection, connectionState =>
    get(connectionState, ['connection', 'loading']),
  );

export {
  selectConnection,
  makeSelectConnectionList,
  makeSelectConnectionListLoading,
  makeSelectConnection,
  makeSelectConnectionLoading,
};
