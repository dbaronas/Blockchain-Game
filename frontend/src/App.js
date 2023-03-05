import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Users from "./user/pages/Users";
import Game from "./game/pages/Game";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>
        <Route path="/game" exact={true}>
          <Game />
        </Route>
        <Redirect to="/" />
    </Switch>
  </Router>
  );
};

export default App;