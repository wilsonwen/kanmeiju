import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { VelocityTransitionGroup } from 'velocity-react';

import Spin from '../spin'
import Config from '../../config'
import SeasonList from './seasonlist'

class Last extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  		searchDone: false,
  		json: {}
  	}
  	this.config = Config();
  	this.fetchData = this.fetchData.bind(this);
  }


  /* callde first initialize */
  componentDidMount() {
  	this.fetchData();
  }

  fetchData() {
    let lastVisited = [];
  	if (localStorage['lastVisited'] !== undefined) {
      lastVisited = JSON.parse(localStorage['lastVisited']);
      this.setState({
        searchDone: true,
        json: lastVisited
      });
    } else {
      let url = '/latest';
      hashHistory.push(url);
    }
  }

  render() {

  	let content = null;

  	/* Check search done */
  	if (this.state.searchDone) 
  	{
	  	
  	  let objList = [];

  	  /*  Season Object
  	   * {id, cover, title, intro}
  	   */
			for(var i = 0; i < this.state.json.length; i++) {
				let obj = this.state.json[i];
				objList[i] = {id: obj.id, cover: obj.cover, title: obj.title, intro: obj.brief};
			}
	  	
	  	content = <div>
                  <h2 className="text-center">最近观看</h2>
                  <hr/>
                  <SeasonList objList={objList} />
                </div>

		} else {
			content = <Spin />
		}


  	return (
  	  <div>
  	  	{ content }
  	  </div>
  	)

  }
}

export default Last;