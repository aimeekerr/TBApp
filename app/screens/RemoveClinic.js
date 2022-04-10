import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, Dimensions } from 'react-native';

export default function RemoveClinic( {navigation} ) {
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View>
                <Text>Remove</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
    },
})