import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import './index.css';
import App from './App';
import Index from './components/pages/index';
import Hot from './components/pages/hot';
import Top from './components/pages/top';
import Category from './components/pages/category';
import AlbumList from './components/pages/albumlist';
import Album from './components/pages/album';
import SearchResults from './components/pages/searchresults';
import Episode from './components/pages/episode';
import Video from './components/pages/video';
import registerServiceWorker from './registerServiceWorker';

// veloctity animation
require('velocity-animate');
require('velocity-animate/velocity.ui');

// google analytics
var ReactGA = require('react-ga');
ReactGA.initialize('UA-41223128-5');
function routerOnUpdate() {
  window.scrollTo(0, 0);
  var hash = window.location.hash;
  var path = hash.substring(0, hash.indexOf('?'));
  ReactGA.set({ page: window.location.pathname + path });
  ReactGA.pageview(window.location.pathname + path);
}


ReactDOM.render((
  <Router onUpdate={routerOnUpdate} history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} id={0} />
      <Route path="/latest" component={Index} id={0} />
      <Route path="/hot" component={Hot} />
      <Route path="/top" component={Top} />
      <Route path="/category/:type" component={Category}/>
      <Route path="/english" component={Index} id={2} />
      <Route path="/show" component={Index} id={4} />
      <Route path="/documentry" component={Index} id={5} />
      <Route path="/albumlist" component={AlbumList} />
      <Route path="/album/:albumid" component={Album} />
      <Route path="/drama/:keyText" component={SearchResults}/>
      <Route path="/episode/:sid" component={Episode}/>
      <Route path="/video/:episodeSid/:title" component={Video} />
    </Route>
  </Router>)
  , document.getElementById('root'));
registerServiceWorker();

