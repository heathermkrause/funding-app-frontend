import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Stakeholder } from './Stakeholder';
import { UserEdit, UserMain } from './User';
import { Profile } from './Profile';
import { TopBar } from '../../components/TopBar';
import { isAdmin, isOwnerOrAdmin } from '../../utils/permission';

const AppScreens = () => {
  const currentUser = useSelector(state => state.auth.currentUser);

  return (
    <>
      <TopBar currentUser={currentUser} />
      <div className="background-image">
        <div className="inner"></div>
      </div>
      <Switch>
        <Route exact path="/" component={Stakeholder} />
        {isAdmin(currentUser) && (
          <Route path="/users/:id" component={UserEdit} />
        )}
        {isAdmin(currentUser) && <Route path="/users" component={UserMain} />}
        <Route path="/profile" component={Profile} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export { AppScreens };
