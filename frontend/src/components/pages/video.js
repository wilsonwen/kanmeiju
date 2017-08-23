import React, { Component } from 'react';
import Config from '../../config'
import { browserHistory } from 'react-router';
import Spin from '../spin'
import { VelocityTransitionGroup } from 'velocity-react';

import './video.css'

class Video extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fetchDone: false,
			json : ""
		}
		this.config = Config();
  	this.fetchData = this.fetchData.bind(this);
  	this.handleError = this.handleError.bind(this);
	}

	  /* callde first initialize */
  componentDidMount() {
  	this.fetchData(this.props.params.episodeSid);
  }

  fetchData(episodeSid) {
  	let url = this.config.server + '/api/m3u8/' + episodeSid;
  	fetch(url).then((res) => res.json()).then((data) => {
  		this.setState({
  			fetchDone: true,
  			json: data
  		});
  	}).catch(function(error){
  		this.setState({
  			fetchDone: true
  		})
  	}.bind(this));
  }

  handleError() {
  	this.setState({json: {'data': undefined}});
  }

  render() {
  	let content = null; 

    /* Check search done */
  	if (this.state.fetchDone) {
	  	if (this.state.json.data !== undefined &&
	  			this.state.json.data.m3u8 !== undefined &&
	  			this.state.json.data.m3u8.url !== "") {
	  		content = <video className="col-xs-12" 
	  						 src={this.state.json.data.m3u8.url} 
	  						 type="video/mp4" 
	  						 onError={this.handleError}
	  						 controls autoPlay>
                	  </video>
		  } else {
		  	content = <div className="alert alert-danger" role="alert">
									  <span className="sr-only">Error:</span>
									  抱歉，视频已经下线。<a href="#" onClick={browserHistory.goBack}>返回剧集</a>
									</div>
		  }
		} else {
			content = <Spin />
		}

    return (
	    <div className="col-xs-12">
	    	<VelocityTransitionGroup enter={{animation: "transition.slideLeftIn"}} leave={{animation: "transition.slideRightOut"}}
                                  runOnMount={true}>
	    	<h4>{this.props.params.title}</h4>
	    	{ content }
	    	</VelocityTransitionGroup>
	    </div>
    )
	}
}

export default Video;