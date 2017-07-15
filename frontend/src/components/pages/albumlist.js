import React, { Component } from 'react';
import { hashHistory, Link } from 'react-router';
import { VelocityTransitionGroup } from 'velocity-react';

import Spin from '../spin'
import Config from '../../config'
import Season from './season'
import './albumlist.css'

class AlbumRow extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let url = '/album/' + this.props.id;
    return (
      
      <div className="season-row row">
        <Link to={url} >
          <VelocityTransitionGroup enter={{animation: "transition.slideLeftIn"}} leave={{animation: "transition.slideRightOut"}}
                                  runOnMount={true}>
            <div className="col-xs-4">
              <img src={this.props.cover} width="100%"/>
            </div>
            <div className="col-xs-8">
              <p className="album-title">{this.props.title}</p>
              <p className="album-intro">{this.props.intro}</p>
            </div>
            </VelocityTransitionGroup>
          </Link>
      </div>

    )
  }
}


class AlbumList extends Component {
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
	  			this.state.json.data.album !== undefined &&
	  			this.state.json.data.album.length !== 0) 
	  	{
	  	  let list = [];
	  	  let id = 8;
	  	  let albums = this.state.json.data.album;

				for(var i = 0; i < albums.length; i++) {
					let obj = albums[i];
					list.push(<AlbumRow key={i} id={obj.id} cover={obj.coverUrl} title={obj.name} intro={obj.brief} /> );
				}
		  	
		  	content = <div>{ list }</div>

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

export default AlbumList;