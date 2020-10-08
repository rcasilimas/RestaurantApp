import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';/* 
import * as firebase from 'firebase'; */

import couponReducer from './store/reducers/coupons'
import addressReducer from './store/reducers/address'
import categoryReducer from './store/reducers/category';
import authReducer from './store/reducers/auth';
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import NavigationContainer from './navigation/NavigationContainer';
import ordersReducer from './store/reducers/orders'
/* import { init } from './helpers/db'

init().then(() => {
  console.log('Initialized Database')
}).catch(err => {
  console.log('DB ERROR')
  console.log(err);
})
 */

/* var firebaseConfig = {
  apiKey: 'AIzaSyBH_wHzZGg9XypV0bpfR3l_mdBL8JS5pI4',
  authDomain: 'shop-9368a.firebaseapp.com',
  databaseURL: 'https://shop-9368a.firebaseio.com/',
  storageBucket: 'shop-9368a.appspot.com'
};
firebase.initializeApp(firebaseConfig); */

const rootReducer = combineReducers({
  categories: categoryReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
  address: addressReducer,
  coupons: couponReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
    return Font.loadAsync({
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    });
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return <AppLoading 
    startAsync={fetchFonts} 
    onFinish={() => {
        setFontLoaded(true);
    }} 
    />
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}