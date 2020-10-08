import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation'

import ShopNavigator from './ShopNavigator';
import ShopNavigatorAdmin from './ShopNavigatorAdmin';

const NavigationContainer = props => {
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.token);
    const userId = useSelector(state => state.auth.userId);

    useEffect(() => {
        if (!isAuth) {
            navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}))
        }
    }, [isAuth])

    

    if (userId == '-LyVX22Wb2_CvAqp-u4n') {
        return <ShopNavigatorAdmin ref={navRef} />
    } else {
        return <ShopNavigator ref={navRef} />
    }

    
}

export default NavigationContainer