import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Posts from './Posts';
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

  }

  render() {
    return (
        <Router>
            <div>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/innergroup">Inner Group</a></li>
                    <li><a href="/savednotes">Saved Notes</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
                <Route path="/" exact render={
                    () => {
                      return (<div>
                          <Posts database={this.database} inner={0}/>
                      </div>);
                    }
                }/>
                <Route path="/innergroup" exact render={
                    () => {
                        return (<div>
                            <Posts database={this.database} inner={1}/>
                        </div>);
                    }
                }/>
                <Route path="/about" exact render={
                    () => {
                        return (<div><h1>About Page</h1></div>);
                    }
                }/>
            </div>
        </Router>
    );
  }
}

export default App;
