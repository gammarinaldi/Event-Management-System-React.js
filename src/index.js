import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'mdbreact/dist/css/mdb.css';
import './supports/font-awesome/css/font-awesome.min.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

ReactDOM.render(
<Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Provider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
