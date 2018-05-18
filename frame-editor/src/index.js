import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import './index.css';
import frameEditor from './reducers';
import registerServiceWorker from './registerServiceWorker';


const store = createStore(frameEditor);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
