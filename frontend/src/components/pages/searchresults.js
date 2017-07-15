import React, { Component } from 'react';
import Config from '../../config'
import { hashHistory } from 'react-router';
import Spin from '../spin'
import { VelocityTransitionGroup } from 'velocity-react';

import SeasonList from './seasonlist'

class SearchResults extends Component {
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
  	this.fetchData(this.props.params.keyText);
  }

  /* called after props update, before state changed */
  /* !Unusd now */
  componentWillReceiveProps(nextProps) {
  	this.fetchData(nextProps.params.keyText)
  }

  fetchData(keyText) {
  	let url = this.config.server + '/api/search/' + keyText;
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
  	if (this.state.searchDone) {
	  	if (this.state.json.data !== undefined &&
	  			this.state.json.data.results !== undefined &&
	  			this.state.json.data.results.length !== 0) {
	  		let objList = [];
	  	  let results = this.state.json.data.results;
	  	  results.sort(function(a, b) {
				    return a.id - b.id;
				});

		  	for(var i = 0; i < results.length; i++) {
					let obj = results[i];
					objList.push({id: obj.id, cover: obj.cover, title: obj.title, intro: obj.brief});
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

export default SearchResults;