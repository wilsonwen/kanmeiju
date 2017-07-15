import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import logo from './logo.png'
import './nav.css';

class Nav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keyText: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  handleChange(event) {
    this.setState({keyText: event.target.value});
  }

  handleClick() {
    let url = '/drama/' + this.state.keyText;
    hashHistory.push(url);
  }

  handleEnter(event) {
    if (event.key === 'Enter') {
      this.handleClick();
    }
  }

  render() {
  	return (
  	  <div>
  	  	<nav id="nav" className="navbar navbar-fixed-top">
          <div className="container">
            <div className="row">
              <div className="col-sm-2 hidden-xs ">
                <Link className="navbar-brand" to="/">
                  <img src={logo} height="27px"/>
                  <span className="title hidden-sm"><strong>看美剧</strong></span>
                  
                </Link>
              </div>

              <div className="navbar-search col-sm-8 col-xs-12">
                <div className="input-group">

                  <input className='form-control' 
                         type='text' 
                         placeholder='输入美剧名称...'
                         value={this.state.keyText}
                         onChange={this.handleChange}
                         onKeyPress={this.handleEnter} />

                  <span className="input-group-btn">
                    <button className="btn btn-default" 
                            type="button" 
                            onClick={this.handleClick}>
                      Go!
                    </button>
                  </span>
                  
                </div>
              </div>
            </div>

          </div>
        </nav>
  	  </div>
  	)

  }
}

export default Nav;