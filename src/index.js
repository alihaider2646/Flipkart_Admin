import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom';

// for simplicity not requirement
window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();


// BY using redux library we can create a store for managing globaly states
// BY using react-redux library we can connect our Components with the store so we can access the information from the store
// BY using redux-thunk library we can make api call asynchronously
