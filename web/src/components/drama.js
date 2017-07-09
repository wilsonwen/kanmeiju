import React, { Component } from 'react';
import Config from '../config'
import { hashHistory } from 'react-router';
import Spin from './spin'

class DramaRow extends Component {

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		let url = '/episode/' + this.props.object.sid;
    hashHistory.push(url);
	}

	render() {
	  return (
	  	<div className="row">
					<div className="panel panel-primary"
							 role='button'
							 onClick={this.handleClick}>
						<div className="panel-heading">
							<h3 className="panel-title">{this.props.object.title}</h3>
						</div>
					  <div className="panel-body">
					    <div className="col-md-2 col-xs-4">
					    	<img src={this.props.object.cover} width="100%"/>
					    </div>
					    <div className="col-md-10 col-xs-8 text-left">
					    	{this.props.object.brief}
					    </div>
					  </div>
					</div>
			</div>
		)
	}
}

class Drama extends Component {
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
  	console.log(url);
  	fetch(url).then((res) => res.json()).then((data) => {
  		console.log(data);
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
	  		let list = [];
	  	  let results = this.state.json.data.results;
	  	  results.sort(function(a, b) {
				    return a.id - b.id;
				});
				console.log(results);
		  	for(var i = 0; i < results.length; i++) {
		  		list.push(<DramaRow object={results[i]} key={i} />)
		  	}
		  	content = <div>
		  						<h3 className="text-left"> 搜索结果 ： </h3>
		  						{ list }
		  						</div>
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
  	  <div className='col-lg-10 col-centered'>
  	  	{ content }
  	  </div>
  	)

  }
}

export default Drama;