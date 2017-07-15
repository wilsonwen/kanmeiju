import React, { Component } from 'react';
import Config from '../../config'
import { hashHistory } from 'react-router';
import Spin from '../spin'
import './episode.css'

import { VelocityTransitionGroup } from 'velocity-react';

class EpisodeId extends Component {

	handleClick() {
		let url = '/video/'  + this.props.episode.episodeSid + 
							'/' + this.props.title;
    hashHistory.push(url);
	}

	render() {
		return (
			<button type="button" 
							className="btn btn-default"
							onClick={this.handleClick.bind(this)}>
				{this.props.episode.episode}
			</button>
		)
	}
}


class Episode extends Component {
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
  	this.fetchData(this.props.params.sid);
  }

  fetchData(sid) {
  	let url = this.config.server + '/api/detail/' + sid;
  	fetch(url).then((res) => res.json()).then((data) => {
  		this.setState({
  			searchDone: true,
  			json: data
  		});
  	}).catch(function(error){
  		this.setState({
  			searchDone: true
  		})
  	}.bind(this));
  }

  render() {

  	let content = null;

  	/* Check search done */
  	if (this.state.searchDone) {
	  	if (this.state.json.data !== undefined &&
	  			this.state.json.data.season !== undefined &&
	  			this.state.json.data.season.playUrlList !== undefined &&
	  			this.state.json.data.season.playUrlList.length !== 0) {
	  		let season = this.state.json.data.season;

	  		/* episodes list */
	  		let episodes = [];
	  	  let list = season.playUrlList;
	  	  list.sort(function(a, b) {
				    return a.episode - b.episode;
				});
		  	for(var i = 0; i < list.length; i++) {
		  		let title = '《' + this.state.json.data.season.title + '》第' + list[i].episode + '集'
		  		episodes.push(
		  			<EpisodeId key={i} episode={list[i]} title={title}/>
		  		)
		  	}
		  	/* content */
		  	content = <div className="panel panel-primary"
											 onClick={this.handleClick}>
										<div className="panel-heading">
											<h3 className="panel-title">{season.title}</h3>
										</div>
									  <div className="panel-body">
									    <div className="row">
										    <div className="col-md-2 col-xs-4">
										    	<img src={season.cover} width="100%"/>
										    </div>
										    <div className="col-md-10 col-xs-8 text-left">
										    	<div className="row">
										    		{season.brief}
										    	</div>
										    </div>
										  </div>
										  <div className="row text-center">
									    		
									    	{episodes}
									    		
									    	</div>
									  	</div>
									</div>

		  } else {
		  	content = <div className="alert alert-danger" role="alert">
									  <span className="sr-only">Error:</span>
									  无法加载剧集。<a href="#" onClick={hashHistory.goBack}>返回搜索结果</a>
									</div>
		  }
		} else {
			content = <Spin />
		}

  	return (
  	  <div>
  	  	<VelocityTransitionGroup enter={{animation: "transition.slideLeftIn"}} leave={{animation: "transition.slideRightOut"}}
                                  runOnMount={true}>
  	  	{ content }
  	  	</VelocityTransitionGroup>
  	  </div>
  	)

  }
}

export default Episode;