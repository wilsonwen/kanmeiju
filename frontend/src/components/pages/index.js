import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { VelocityTransitionGroup } from 'velocity-react';

import Spin from '../spin'
import Config from '../../config'
import SeasonList from './seasonlist'

class Index extends Component {
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
  	let url = this.config.server + '/api/index/';
  	fetch(url).then((res) => res.json()).then((data) => {
  		this.setState({
  			searchDone: true,
  			json: data
  		});
  	});
  }

  render() {

  	let content = null;

  	/* Check search done */
  	if (this.state.searchDone) 
  	{
	  	if (this.state.json.data !== undefined &&
	  			this.state.json.data.index !== undefined &&
	  			this.state.json.data.index.length !== 0) 
	  	{
	  	  let objList = [];
	  	  /*
 				 * Index api returns results including ['latest', 'weekly', 'english episode', ...]
	  	   */
	  	  let id = this.props.route.id;
	  	  let index = this.state.json.data.index[id].seasonList;

	  	  /*  Season Object
	  	   * {id, cover, title, intro}
	  	   */
				for(var i = 0; i < index.length; i++) {
					let obj = index[i];
					objList.push({id: obj.id, cover: obj.cover, title: obj.title});
				}
		  	
		  	content = <div><SeasonList objList={objList} /></div>

		  } else {
		  	content = <div className="alert alert-danger" role="alert">
									  <span className="sr-only">Error:</span>
									  找不到和您查询的<strong><em>"{this.props.params.keyText}"</em></strong>相符的内容或信息。
									  <a href="#" onClick={hashHistory.goBack}>返回搜索</a>
									</div>
		  }
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

export default Index;