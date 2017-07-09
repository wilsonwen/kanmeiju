import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import './index.css';
import App from './App';
import SearchBar from './components/searchbar'
import Drama from './components/drama';
import Episode from './components/episode';
import Video from './components/video';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <Router onUpdate={() => window.scrollTo(0, 0)} history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={SearchBar}/>
      <Route path="/drama/:keyText" component={Drama}/>
      <Route path="/episode/:sid" component={Episode}/>
      <Route path="/video/:episodeSid/:title" component={Video} />
    </Route>
  </Router>)
  , document.getElementById('root'));
registerServiceWorker();
