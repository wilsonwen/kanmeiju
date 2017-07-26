import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { VelocityTransitionGroup } from 'velocity-react';

import "./season.css"

class Season extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		let intro = ""
  	if (this.props.intro !== undefined) {
  		intro = this.props.intro.substr(0, 100) + "...";
  	}

  	let url = '/episode/' + this.props.id;;
	  return (
	  	
	  	<div className="season-row row">
	  	  <Link to={url} >
		  		<VelocityTransitionGroup enter={{animation: "transition.slideLeftIn"}} leave={{animation: "transition.slideRightOut"}}
	                                runOnMount={true}>
						<div className="col-sm-2 col-xs-5">
							<img src={this.props.cover} width="100%"/>
						</div>
						<div className="col-sm-10 col-xs-7">
							<p className="season-title">{this.props.title}</p>
							<p className="season-intro">{intro}</p>
						</div>

						</VelocityTransitionGroup>
					</Link>
			</div>

		)
	}
}

export default Season;