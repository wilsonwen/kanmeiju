import React, { Component } from 'react';
import { RouteTransition } from 'react-router-transition';
import Nav from './components/nav'
import './App.css';

class App extends Component {
  render() {

    return (
      <div className="App container">

        {/* Navigation bar */}
        <Nav />

          {this.props.children}

      </div>
    );
  }

}

export default App;
