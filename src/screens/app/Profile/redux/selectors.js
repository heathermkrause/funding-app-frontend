import { createSelector } from 'reselect';

const selectProfile = state => state.app.profileState;

const makeSelectUserListLoading = () =>
  createSelector(selectProfile, profileState => profileState.users.loading);

const makeSelectUser = () =>
  createSelector(selectProfile, profileState => profileState.user.data);

const makeSelectUserLoading = () =>
  createSelector(selectProfile, profileState => profileState.user.loading);

export {
  selectProfile,
  makeSelectUserListLoading,
  makeSelectUser,
  makeSelectUserLoading,
};
