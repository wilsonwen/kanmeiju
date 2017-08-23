import React, { Component } from 'react';
import Config from '../../config'
import { browserHistory } from 'react-router';
import Spin from '../spin'
import './episode.css'

import { VelocityTransitionGroup } from 'velocity-react';
import ShareButtons from 'react-share-buttons'

var urlencode = require('urlencode')




class EpisodeId extends Component {

	handleClick() {
		let url = '/video/'  + this.props.episode.episodeSid + 
							'/' + this.props.title;
		localStorage[this.props.sid] = JSON.stringify(this.props.episode.episode);
    browserHistory.push(url);
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
  		json: {},
  		lastWatched: 0
  	}
  	this.config = Config();
  	this.fetchData = this.fetchData.bind(this);
  	this.updateLastVisited = this.updateLastVisited.bind(this);
  }

  /* callde first initialize */
  componentDidMount() {
  	let sid = this.props.params.sid
  	this.fetchData(sid);
  	if (localStorage[sid] !== undefined) {
  		this.setState({
  			lastWatched: JSON.parse(localStorage[sid])
  		})
  	}
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

  /* update last visited in localstorage */
  updateLastVisited(obj) {
  	let lastVisited = [];
  	let MAX_LEN = 10;
  	if (localStorage['lastVisited'] !== undefined) {
  		lastVisited = JSON.parse(localStorage['lastVisited']);
  	}

  	// deduplicate
  	for (let i = 0; i < lastVisited.length; i++) {
  		if (lastVisited[i].id === obj.id) {
  			lastVisited.splice(i, 1);
  			break;
  		}
  	}

  	if (lastVisited.length > MAX_LEN) {
  		lastVisited.shift();
  		
  	}

  	lastVisited.push({id: obj.id, cover: obj.cover, title: obj.title, brief: obj.brief});
  	localStorage['lastVisited'] = JSON.stringify(lastVisited);
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
	  		this.updateLastVisited(season);

	  		/* episodes list */
	  		let episodes = [];
	  	  let list = season.playUrlList;
	  	  list.sort(function(a, b) {
				    return a.episode - b.episode;
				});
		  	for(var i = 0; i < list.length; i++) {
		  		let title = '《' + this.state.json.data.season.title + '》第' + list[i].episode + '集'
		  		episodes.push(
		  			<EpisodeId key={i} episode={list[i]} title={title} sid={this.props.params.sid}/>
		  		)
		  	}

		  	let note = null
		  	if(this.state.lastWatched !== 0) {
		  		note = <div className="alert alert-danger">上次观看到第<strong>{this.state.lastWatched}</strong>集</div>
		  	}

		  	let url = urlencode("http://kanmeiju.herokuapp.com" + this.props.location.pathname);
		  	console.log(url);
		  	let description = "我在这里观看了《" + season.title +"》，快来一起看吧！" ;
		  	let shareButton = <ShareButtons 
													  sites = {["qzone", "weibo", "qq", "tencent", "douban", "linkedin", "facebook", "google", "twitter" ]}
													  url = {url}
													  title = {season.title}
													  description = {description}
													  image=''
													/>

		  	/* content */
		  	content = <div className="panel panel-primary"
											 onClick={this.handleClick}>

										<script type="text/javascript" src="//cdn.chitika.net/getads.js" async></script>

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
									    <div>
									    	{note}
									    </div>


									    { shareButton }

									    
									    
									  </div>
									</div>

		  } else {
		  	content = <div className="alert alert-danger" role="alert">
									  <span className="sr-only">Error:</span>
									  无法加载剧集。<a href="#" onClick={browserHistory.goBack}>返回搜索结果</a>
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