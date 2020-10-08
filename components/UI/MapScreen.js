import React from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Linking } from 'expo';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = props => {
    const lat = props.navigation.getParam('lat');
    const lng = props.navigation.getParam('lng');
    const location = props.navigation.getParam('location')
    let placeId = '';
    let destination = '';

    mapRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }

    const title = 'Kokoye Bar & Grill';
    let description = null;

    if (location === 'Port') {
        description = 'Delmas 31, Port-au-Prince, Haiti'
        placeId = 'ChIJnVSW4r_nuY4R6SbuNe8ph6g'
        destination = 'Kokoye+Bar+Grill+Port+Au+Prince'
    } else if (location === 'Petion') {
        description = '2 Darguin, Petion-Ville, Haiti'
        placeId = 'ChIJs1jH4IfouY4ROylBN40gACw'
        destination = 'Kokoye+Petion+Ville'
    } else {
        description = ''
    }

    console.log(placeId)

    const latLng = `${lat},${lng}`;
    const label = description;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: `https://www.google.com/maps/dir/?api=1&origin=Carrefour+Haiti&destination=${destination}&destination_place_id=${placeId}` });
    const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}`
    });


    const markerHandler = () => {
        Alert.alert(`Kokoye at ${description}`, 'Do You Need Directions On Your Map App?', [{text: 'Yes', onPress: () => {
            Linking.openURL(url);
            }},
        {text: 'No, Take Me Back', onPress: () => {
                props.navigation.goBack();
            }}
        ])
    }

    return (
        <MapView style={styles.map} region={mapRegion}>
            <Marker
                coordinate={{latitude: lat, longitude: lng}}
                title={title}
                description={description}
                onPress={() => {
                    markerHandler()
                }}
            />
        </MapView>
    )
}


 
const styles = StyleSheet.create({
    map: {
        flex: 1
    }
})

export default MapScreen;