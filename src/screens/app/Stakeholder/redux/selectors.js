import { createSelector } from 'reselect';
import get from 'lodash/get';

const selectStakeholder = state => get(state, 'app.stakeholderState');

const makeSelectStakeholderList = () =>
  createSelector(selectStakeholder, stakeholderState =>
    get(stakeholderState, ['stakeholders', 'list']),
  );

const makeSelectStakeholderListLoading = () =>
  createSelector(selectStakeholder, stakeholderState =>
    get(stakeholderState, ['stakeholders', 'loading']),
  );

const makeSelectStakeholder = () =>
  createSelector(selectStakeholder, stakeholderState =>
    get(stakeholderState, ['stakeholder', 'data']),
  );

const makeSelectStakeholderLoading = () =>
  createSelector(selectStakeholder, stakeholderState =>
    get(stakeholderState, ['stakeholder', 'loading']),
  );

export {
  selectStakeholder,
  makeSelectStakeholderList,
  makeSelectStakeholderListLoading,
  makeSelectStakeholder,
  makeSelectStakeholderLoading,
};
