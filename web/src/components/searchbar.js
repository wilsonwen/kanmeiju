import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import Logo from '../newlogo.png'
import './searchbar.css'

class SearchBar extends Component {
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
  	  <div className="row">
        {/* Logo */}
  	    <div className="row">
          <img src={Logo} alt='logo'/>
        </div>
        {/* Search Input */}
        <div className="row">
          <div className="col-lg-8 col-centered">
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
  	)

  }
}

export default SearchBar;