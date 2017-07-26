import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { VelocityTransitionGroup } from 'velocity-react';

import Spin from '../spin'
import Config from '../../config'
import SeasonList from './seasonlist'

class Category extends Component {
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
  	this.fetchData(this.props.params.type);
  }

  /* called after props update, before state changed */
  /* !Unusd now */
  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.params.type)
  }

  fetchData(type) {
    this.setState({
      searchDone: false
    })
  	let url = this.config.server + '/api/category/' + type + '/0';
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
	  			this.state.json.data.results !== undefined &&
	  			this.state.json.data.results.length !== 0) 
	  	{
	  	  let objList = [];
	  	  let list = this.state.json.data.results;

	  	  /*  Season Object
	  	   * {id, cover, title, intro}
	  	   */
				for(var i = 0; i < list.length; i++) {
					let obj = list[i];
					objList.push({id: obj.id, cover: obj.cover, title: obj.title, intro: obj.brief});
				}
		  	
		  	content = <div><SeasonList objList={objList} /></div>

		  } else {
		  	content = <div className="alert alert-danger" role="alert">
									  <span className="sr-only">Error:</span>
									  找不到和您查询的<strong><em>"{this.props.params.keyText}"</em></strong>相符的内容或信息。
									  <a href="#" onClick={browserHistory.goBack}>返回搜索</a>
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

export default Category;