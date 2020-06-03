import { createSelector } from 'reselect';
import get from 'lodash/get';

const selectProject = state => get(state, 'app.projectState');

const makeSelectProjectList = () =>
  createSelector(selectProject, projectState =>
    get(projectState, ['projects', 'list']),
  );

const makeSelectProjectListLoading = () =>
  createSelector(selectProject, projectState =>
    get(projectState, ['projects', 'loading']),
  );

const makeSelectProject = () =>
  createSelector(selectProject, projectState =>
    get(projectState, ['project', 'data']),
  );

const makeSelectProjectLoading = () =>
  createSelector(selectProject, projectState =>
    get(projectState, ['project', 'loading']),
  );

export {
  selectProject,
  makeSelectProjectList,
  makeSelectProjectListLoading,
  makeSelectProject,
  makeSelectProjectLoading,
};
