import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Posts from './Posts';
import Innerposts from './Innerposts';
import Notes from './Notes';
import Stats from './Stats';
import firebase from 'firebase/app';
import 'firebase/database';
import './App.css';

class App extends Component {

  constructor(props) {
      super(props);

      const config = {
          apiKey: "AIzaSyCptg4PxiUJMmYGaud6XJosb-proDpqT9w",
              authDomain: "splitter-board.firebaseapp.com",
          databaseURL: "https://splitter-board.firebaseio.com",
          projectId: "splitter-board",
          storageBucket: "",
          messagingSenderId: "755198199123"
      };

      this.app = firebase.initializeApp(config);
      this.database = this.app.database();
      this.login = this.login.bind(this);
      this.logoff = this.logoff.bind(this);
      this.handleChangeText = this.handleChangeText.bind(this);
      this.randnum = 0;

      this.state = {
          username: '',
          isLoggedIn: false,
      }

  }


    handleChangeText(ev) {
        this.setState({
            username: ev.target.value
        })
    }

  login() {
      const username = this.state.username;
      let usernameRegex = /^[a-zA-Z0-9]+$/;
      let usermatch = username.match(usernameRegex);
      if (usermatch !== null) {

          let randnum = Math.floor(Math.random() * Math.floor(3)) + 1;

          this.databaseGroupnum = this.database.ref().child('groupnum');
          let groupnum = randnum;
          const groupnumToSave = {username, groupnum};

          this.databaseGroupnum.orderByChild("username").equalTo(username).once("value",snapshot => {
              const userData = snapshot.val();
              console.log(userData);
              if (!userData){
                  this.databaseGroupnum.push().set(groupnumToSave);
                  sessionStorage.setItem('groupnum', groupnum);
              } else {
                  for (let property in userData) {
                      if (userData.hasOwnProperty(property)) {
                          sessionStorage.setItem('groupnum', userData[property].groupnum);
                      }
                  }
              }
          });

          sessionStorage.setItem('username', username);
          this.setState({
              isLoggedIn: true,
          })
      } else {
          alert("Username can only contain alphanumeric characters.");
      }
  }

  logoff() {
      sessionStorage.removeItem('username');
      this.setState({
          isLoggedIn: false,
      })
  }

  render() {

      let isLoggedIn = this.state.isLoggedIn;

      if (sessionStorage.getItem('username') !== null ) {
          isLoggedIn = true;
      }


    return (
        <div>
            {isLoggedIn ? ( <Router>
                <div>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/innergroup">Inner Group</a></li>
                        <li><a href="/savednotes">Saved Notes</a></li>
                        <li><a href="/stats">Stats</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a onClick={this.logoff} href="/">Log Off</a></li>
                    </ul>
                    <Route path="/" exact render={
                        () => {
                            return (<div>
                                <Posts database={this.database} username={sessionStorage.getItem('username')}/>
                            </div>);
                        }
                    }/>
                    <Route path="/innergroup" exact render={
                        () => {
                            return (<div>
                                <Innerposts database={this.database} username={sessionStorage.getItem('username')} groupnum={sessionStorage.getItem('groupnum')}/>
                            </div>);
                        }
                    }/>
                    <Route path="/savednotes" exact render={
                        () => {
                            return (<div>
                                <Notes database={this.database} username={sessionStorage.getItem('username')} />
                            </div>);
                        }
                    }/>
                    <Route path="/stats" exact render={
                        () => {
                            return (<div>
                                <Stats database={this.database} />
                            </div>);
                        }
                    }/>
                    <Route path="/about" exact render={
                        () => {
                            return (<div><p>Online Discussion Forum for Educational Technology</p></div>);
                        }
                    }/>
                </div>
            </Router>) : (<div className="wrapper">
                <h2 className="loginHeading">Enter your username:</h2>
                <br />
                <textarea className="loginText" value={this.state.username} onChange={this.handleChangeText}/>
                <br />
                <button className="loginButton" onClick={this.login}>Login</button>
            </div> )}
        </div>


    );
  }
}

export default App;
