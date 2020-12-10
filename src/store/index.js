import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
// import rootReducer from '../reducers/index';
// ************************* OR ************************* 
import rootReducer from '../reducers';

// applyMiddleware(thunk) is used for asyn actions
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;