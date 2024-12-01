import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Equipments from './equipment/pages/Equipments';
import Technicians from './technicians/pages/Technicians';
import NewEquipment from './equipment/pages/NewEquipment';
import UpdateEquipment from './equipment/pages/UpdateEquipment';
import Inventory from './inventory/pages/Inventory';
import NewInventory from './inventory/pages/NewInventory';
import UpdateInventory from './inventory/pages/UpdateInventory';
import Maintance from './maintance/pages/Maintance';
import NewMaintance from './maintance/pages/NewMaintance';
import UpdateMaintance from './maintance/pages/UpdateMaintance';
import Report from './report/pages/Report';
import NewReport from './report/pages/NewReport';
import UpdateReport from './report/pages/UpdateReport';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/technicians" exact>
          <Technicians />
        </Route>
        <Route path="/equipments" exact>
          <Equipments />
        </Route>
        <Route path="/equipments/new" exact>
          <NewEquipment />
        </Route>
        <Route path="/equipments/:id">
          <UpdateEquipment />
        </Route>
        <Route path="/inventory" exact>
          <Inventory />
        </Route>
        <Route path="/inventory/new" exact>
          <NewInventory />
        </Route>
        <Route path="/inventory/:id">
          <UpdateInventory />
        </Route>
        <Route path="/maintance" exact>
          <Maintance />
        </Route>
        <Route path="/maintance/new" exact>
          <NewMaintance />
        </Route>
        <Route path="/maintance/:id">
          <UpdateMaintance />
        </Route>
        <Route path="/reports" exact>
          <Report />
        </Route>
        <Route path="/reports/new" exact>
          <NewReport />
        </Route>
        <Route path="/reports/:id">
          <UpdateReport />
        </Route>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
