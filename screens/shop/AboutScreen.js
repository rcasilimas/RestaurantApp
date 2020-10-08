import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient'
import { Linking } from 'expo';


import Colors from '../../constants/Colors';
import HeaderButton from '../../components/UI/HeaderButton';
import MapPreview from '../../components/UI/mapPreview';
import { setRecoveryProps } from 'expo/build/ErrorRecovery/ErrorRecovery';

const AboutScreen = props => {
    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const Port = {
        lat: 18.549710,
        lng: -72.307001
    }

    const Petion = {
        lat: 18.513895,
        lng: -72.290072
    }

    const phoneHandler = () => {
        Linking.openURL('tel:+509 28 17 7000')
    }

    const mapHandler = (lat, lng, location) => {
        props.navigation.navigate('Maps', {
            lat: lat,
            lng: lng,
            location: location
        })
    }

    return (
        
        <ScrollView style={styles.ScrollView}>
            {/* <LinearGradient colors={[Colors.gradient1, Colors.gradient2]} style={styles.gradient} > */}
            <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>{`Kokoye Bar & Grill`}</Text>
            </View>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{uri: 'https://media-cdn.tripadvisor.com/media/photo-s/0a/ff/81/e0/20160418-135641-largejpg.jpg'}} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.about}>
                    We are a Haitian Restaurant dedicated to serving you the best 
                </Text>
                <Text style={styles.about}>
                    international cuisine you have experienced on this side of the island. 
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.about}>
                    Come give us a try and taste some of our delicious homestyle 
                </Text>
                <Text style={styles.about}>
                    cooking that we are known for. We promise to show you a great time. 
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Our Locations:
                </Text>
                <Text style={styles.listTitle}>
                    Port-au-Prince
                </Text>
                <Text style={styles.list}>
                    Delmas 31, Port-au-Prince, Haiti
                </Text>
                <TouchableCmp onPress={phoneHandler}>
                    <Text style={styles.phone}>
                        +509 28 17 7000
                    </Text>
                </TouchableCmp>
                <View style={styles.mapContainer}>
                    <MapPreview onPress={() => {mapHandler(Port.lat, Port.lng, 'Port')}} location={Port} />
                </View>
                <Text style={styles.listTitle}>
                    Petion-Ville
                </Text>
                <Text style={styles.list}>
                    2 Darguin, Petion-Ville, Haiti
                </Text>
                <TouchableCmp onPress={phoneHandler}>
                    <Text style={styles.phone}>
                        +509 28 17 7000
                    </Text>
                </TouchableCmp>
                <View style={styles.mapContainer}>
                    <MapPreview onPress={() => {mapHandler(Petion.lat, Petion.lng, 'Petion')}} location={Petion} />
                </View>
            </View>
            {/* </LinearGradient> */}
        </ScrollView>
    )

}

AboutScreen.navigationOptions = navData => {
    return {
    headerTitle: 'About Us',
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
    };
};

const styles = StyleSheet.create({
    titleContainer: {
        width: '100%',
        marginVertical: 40
    },
    scrollView: {
        width: '100%'
    },
    mainTitle: {
        fontSize: 32,
        textAlign: 'center',
        fontFamily: 'open-sans-bold'
    },
    textContainer: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: '100%',
        height: 300,
        marginBottom: 30,
        overflow: 'hidden'   
    },
    image: {
        width: '100%',
        height: '100%'
    },
    title: {
        textAlign: 'center',
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        marginBottom: 10
    },
    about: {
        fontFamily: 'open-sans',
        fontSize: 16,
        textAlign: 'center'
    },
    list: {
        fontFamily: 'open-sans',
        fontSize: 16,
        textAlign: 'center'
    },
    phone: {
        marginVertical: 2,
        fontFamily: 'open-sans',
        fontSize: 16,
        color: '#0000EE',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
    listTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginBottom: 5
    },
    mapContainer: {
        marginTop: 20,
        marginBottom: 40,
        width: 400,
        height: 300,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default AboutScreen;