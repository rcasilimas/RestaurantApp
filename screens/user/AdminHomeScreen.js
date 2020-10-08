import React from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const AdminHomeScreen = props => {

    return (
    <View style={styles.screen}>
        <LinearGradient colors={[Colors.gradient1, Colors.gradient2]} style={styles.gradient} >
            <Card style={styles.adminContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Admin Control Panel</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                    title={`Manage Products`}
                    color={Colors.accent} 
                    onPress={() => {
                        props.navigation.navigate('UserCategories')
                    }}  
                    />
                        </View>
                <View style={styles.buttonContainer}>
                    <Button 
                    title={`Manage Coupons`}
                    color={Colors.accent} 
                    onPress={() => {
                        props.navigation.navigate('CouponScreen')
                    }}  
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button 
                    title={'See Customer Orders'}
                    color={Colors.accent} 
                    onPress={() => {
                        props.navigation.navigate('AdminOrder')
                    }}  
                    />
                </View>
            </Card>
        </LinearGradient>
    </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    adminContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 25
    },
    titleContainer: {
        width: '100%'
    },
    title: {
        textAlign: 'center',
        fontFamily: 'open-sans-bold',
        fontSize: 24
    }


})

AdminHomeScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Admin',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item 
                title='Menu' 
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' } 
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        ),
    }
}


export default AdminHomeScreen;