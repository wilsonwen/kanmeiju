import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from '../newlogo.png'

class Nav extends Component {
  render() {
  	return (
  	  <div>
  	  	<nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <Link className="navbar-brand" to="/">
                看美剧
                
              </Link>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                
              </ul>
            </div>
          </div>
        </nav>
  	  </div>
  	)

  }
}

export default Nav;