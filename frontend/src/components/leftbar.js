import React, { Component } from 'react';
import { Link } from 'react-router';
import './leftbar.css'

class Leftbar extends Component {
  render() {
  	return (
  	  <div>

        <div id="leftbar-nav" className="hidden-xs affix">
    	  	<nav className="navbar">
            <div className="container">
              <div className="navbar-header">

                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#sidebar1">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>

              </div>
              <div id="sidebar1" className="">
                <ul className="nav navbar-nav">
                  <li><Link to='/latest'>最新更新</Link></li>
                  <li><Link to='/hot'>人气</Link></li>
                  <li><Link to='/top'>好评</Link></li>
                  <li><Link to='/albumlist'>合集</Link></li>
                  <li><Link to='/english'>英剧</Link></li>
                  <li><Link to='/show'>综艺</Link></li>
                  <li><Link to='/documentry'>纪录片</Link></li>
                  
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div className="visible-xs">
          <nav className="navbar navbar-default">
            <div className="container">
              <div className="navbar-header">

                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#sidebar2">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>

              </div>
              <div id="sidebar2" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  <li><Link to='/latest'>最新更新</Link></li>
                  <li><Link to='/hot'>人气</Link></li>
                  <li><Link to='/top'>好评</Link></li>
                  <li><Link to='/albumlist'>合集</Link></li>
                  <li><Link to='/english'>英剧</Link></li>
                  <li><Link to='/show'>综艺</Link></li>
                  <li><Link to='/documentry'>纪录片</Link></li>
                  
                </ul>
              </div>
            </div>
          </nav>
        </div>

  	  </div>
  	)

  }
}

export default Leftbar;