import './App.css';
import './dark-mode.css';
import React, { useEffect } from 'react';
import './components/FontaweomeIcons';
import { Route, Switch } from 'react-router-dom'
import Home from './containers/Home';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import PrivateRoute from './components/HOC/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { isUserLoggedIn, getAllCategory, getInitialData } from './actions'
import Products from './containers/Products';
import Orders from './containers/Orders';
import Category from './containers/Category';
import NewPage from './containers/NewPage';

const App = () => {

  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch();


  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn())
    }
    if (auth.authenticate) {
      // dispatch(getAllCategory());
      dispatch(getInitialData());
    }

  }, [auth.authenticate]);


  return (
    <>
      <Switch>
        {/* <Route exact path="/" component={Home} /> */}
        {/* instead of simple route for home we use private route that we make because for the home page not anyone can access only a login user can see it or work on it */}
        <PrivateRoute exact path="/" component={Home} />
        {/* here we dont use {} curly brackets in our arrow function because we instantly return our jsx */}
        {/* <PrivateRoute path="/products" component={() => <p>Products</p>} /> */}
        <PrivateRoute path="/page" component={NewPage} />
        <PrivateRoute path="/category" component={Category} />
        <PrivateRoute path="/products" component={Products} />
        <PrivateRoute path="/orders" component={Orders} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </>
  );
}

export default App;
