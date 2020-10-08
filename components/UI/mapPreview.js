import React from 'react';
import { View, Image, TouchableOpacity, TouchableNativeFeedback, Platform, StyleSheet } from 'react-native';

const MapPreview = props => {
    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center${props.location.lat},${props.location.lng}&zoom=13&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${props.location.lat},${props.location.lng}&key=AIzaSyBDYzy10uggS9_gYUTXVuZlUK1b-SvOEUI`
    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }


    return <TouchableCmp onPress={props.onPress} style={{...styles.MapPreview, ...props.style}}>
        <Image style={styles.mapImage} source={{uri: imagePreviewUrl}} />
    </TouchableCmp>
}

const styles = StyleSheet.create({
    MapPreview: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapImage: {
        width: '100%',
        height: '100%'
    }
})

export default MapPreview;