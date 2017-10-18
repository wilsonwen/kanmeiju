import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// veloctity animation
require('velocity-animate');
require('velocity-animate/velocity.ui');

// google analytics
var ReactGA = require('react-ga');
ReactGA.initialize('UA-41223128-5');
function routerOnUpdate() {
  window.scrollTo(0, 0);
  ReactGA.set({ page: window.location.pathname});
  ReactGA.pageview(window.location.pathname);
}

function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(({default: Component}) => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

const Index = asyncComponent(() => import('./components/pages/index'))
const Last = asyncComponent(() => import('./components/pages/last'))
const Hot = asyncComponent(() => import('./components/pages/hot'))
const Top = asyncComponent(() => import('./components/pages/top'))
const Category = asyncComponent(() => import('./components/pages/category'))
const AlbumList = asyncComponent(() => import('./components/pages/albumlist'))
const Album = asyncComponent(() => import('./components/pages/album'))
const SearchResults = asyncComponent(() => import('./components/pages/searchresults'))
const Episode = asyncComponent(() => import('./components/pages/episode'))
const Video = asyncComponent(() => import('./components/pages/video'))


ReactDOM.render((
  <Router onUpdate={routerOnUpdate} history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Last} />
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

