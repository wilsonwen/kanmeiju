import React, { Component } from 'react';
import Nav from './components/nav'
import Leftbar from './components/leftbar'
import Rightbar from './components/rightbar'
import './App.css';

class App extends Component {
  render() {

    return (
      <div className="App container">

        {/* Navigation bar */}
        <Nav />


        <div className="row">
        	<div className="col-sm-2">
        		<Leftbar />
        	</div>
        	<div className="content col-sm-8">
        		{this.props.children}
        	</div>
        	<div className="col-sm-2">
        		<Rightbar />
        	</div>
        </div>
          
        
      </div>
    );
  }

}

export default App;
