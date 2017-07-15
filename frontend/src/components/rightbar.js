import React, { Component } from 'react';
import { Link } from 'react-router';
import './rightbar.css'

class Rightbar extends Component {
  render() {
  	return (
  	  <div id="rightbar-nav" className="affix hidden-xs">
  	  	<nav className="navbar">
          <div className="container">
            <div className="navbar-header">

              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#sidebar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

            </div>
            <div id="sidebar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li><Link to='/category/爱情'>爱情</Link></li>
                <li><Link to='/category/剧情'>剧情</Link></li>
                <li><Link to='/category/喜剧'>喜剧</Link></li>
                <li><Link to='/category/科幻'>科幻</Link></li>
                <li><Link to='/category/动作'>动作</Link></li>
                <li><Link to='/category/犯罪'>犯罪</Link></li>
                <li><Link to='/category/冒险'>冒险</Link></li>
                <li><Link to='/category/家庭'>家庭</Link></li>
                <li><Link to='/category/战争'>战争</Link></li>
                <li><Link to='/category/悬疑'>悬疑</Link></li>
                <li><Link to='/category/恐怖'>恐怖</Link></li>
                <li><Link to='/category/历史'>历史</Link></li>
                <li><Link to='/category/伦理'>伦理</Link></li>
                
              </ul>
            </div>
          </div>
        </nav>
  	  </div>
  	)

  }
}

export default Rightbar;