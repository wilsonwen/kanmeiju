import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { VelocityTransitionGroup } from 'velocity-react';

import Season from './season'

class SeasonList extends Component {
  constructor(props) {
  	super(props);
  }

  render() {
    let seasonList = []
    let objList = this.props.objList;

		for(var i = 0; i < objList.length; i++) {
			let obj = objList[i];
			seasonList.push(<Season key={i} id={obj.id} cover={obj.cover} title={obj.title} intro={obj.intro} /> );
		}
		  	
  	return (
  	  <div>
  	  	{ seasonList }
  	  </div>
  	)
  }
}

export default SeasonList;