import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Users from "./user/pages/Users";
import Game from "./game/pages/Game";
// import MainNavigation from "./shared/components/Navigation/MainNavigation";
import NavBarComp from "./shared/components/Navigation/NavBarComp";

const App = () => {
  return (
    <Router>
      <NavBarComp />
      <main>
        <Switch>
          <Route path="/users" exact={true}>
            <Users />
          </Route>
          <Route path="/game" exact={true}>
            <Game />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
