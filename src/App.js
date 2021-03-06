import React, { Component } from 'react';
import './App.css';
import { Switch, Route, withRouter } from 'react-router-dom'
import Landing from './Components/Landing/Landing';
import Login from './Components/Auth/Login/Login'
import Register from './Components/Auth/Login/Register'
import Nav from './Components/Nav/Nav'
import Dashboard from './Components/Dashboard/Dashboard'
import EditUserInfo from './Components/EditUserInfo/EditUserInfo'
import Stats from './Components/Stats/Stats';
import Verify from './Components/Verify/Verify';

import Marketplace from './Components/Marketplace/Marketplace'

class App extends Component {

  state = {
    loggedUser: {}
  }


  doLoginUser = async (user) => {
    try {
      const loginResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!loginResponse.ok) {
        throw Error(loginResponse.statusText);
      }

      const parsedResponse = await loginResponse.json();
      if (parsedResponse.message === "login successful") {
        //Resets this component's state if a use was successfully logged in
        this.setState({
          loggedUser: parsedResponse.data
        });

        this.props.history.push(`/dashboard`);
        console.log(parsedResponse, 'logged in')
      } else {
        this.setState({
          loginError: parsedResponse.message
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  doLogoutUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`)

      if (!response.ok) {
        throw Error(response.statusText)
      } else {
        console.log(response)
      }

      const deletedSession = await response.json();
      this.setState({
        loggedUser: deletedSession.user || {}
      })

      this.props.history.push('/login')
      console.log(deletedSession, 'logged')

    }
    catch (err) {
      console.log(err)
      console.log('hitting')
    }
  }

  doDeleteUser = async () => {
    try {
      const deletedUser = await fetch(`${process.env.REACT_APP_API_URL}/creators/${this.state.loggedUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!deletedUser.ok) {
        throw Error(deletedUser.statusText);
      }
      const parsedDeletedResponse = await deletedUser.json();
      this.setState({
        loggedUser: {}
      })
      this.props.history.push('/')
      console.log(parsedDeletedResponse, "this is the deleted User")
    }
    catch (err) {
      console.log(err)
    }
  }

  doEditUser = async (editUserInfo) => {
    try {
      console.log(editUserInfo, 'hitting edit user')
      const editedUser = await fetch(`${process.env.REACT_APP_API_URL}/creators/${this.state.loggedUser._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(editUserInfo),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!editedUser.ok) {
        throw Error(editedUser.statusText);
      }

      const parsedResponse = await editedUser.json();
      this.setState({
        loggedUser: parsedResponse.data
      });
      this.props.history.push(`/dashboard`);
      console.log(parsedResponse, 'mom updated')

    } catch (err) {
      console.log(err);
    }

  }

  render() {
    return (
        <div>
            <Nav doLogOutUser={this.doLogoutUser} loggedUser={this.state.loggedUser} />
            <Switch>
                <Route exact path="/" component={() => <Landing />} />
                <Route exact path="/register" component={() => <Register />} />
                <Route exact path="/login" component={(...props) => <Login doLoginUser={this.doLoginUser} />} />
                <Route exact path="/dashboard" component={() => <Dashboard doLogOutUser={this.doLogOutUser} loggedUser={this.state.loggedUser} doDeleteUser={this.doDeleteUser} />} />
                <Route exact path="/edit-profile" component={() => <EditUserInfo loggedUser={this.state.loggedUser} doEditUser={this.doEditUser} />} />
                <Route exact path="/stats" component={() => <Stats loggedUser={this.state.loggedUser}  doEditUser={this.doEditUser}/>} />
                <Route exact path="/marketplace" component={() => <Marketplace />} />
                <Route exact path="/verify" component={() => <Verify  />} />
            </Switch>
        </div>
    );
  }
}

export default withRouter(App);
