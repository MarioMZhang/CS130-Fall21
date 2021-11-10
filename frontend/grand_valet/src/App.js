import React from "react";
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import LogIn from './components/login/login';
import LogInImage from './components/login/loginImage';
import SignUp from './components/login/signup';
import CustomerDropoffWrapper from './components/customer/dropoff/dropoffWrapper';


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={LogInImage} exact/>
          <Route path="/signup" component={SignUp} />
          <Route path="/customer" component={CustomerDropoffWrapper}/>
        </Switch>
      </BrowserRouter>
  )
}

export default App;
