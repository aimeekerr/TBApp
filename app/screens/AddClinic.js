import { React, useState } from 'react';
import { ImageBackground, View, StyleSheet, Text, Button, Dimensions, TextInput } from 'react-native';

export default function AddClinic( {navigation, route} ) {
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View>
                <Text style={styles.main}>
                    Please Enter New Clinic's Email Address
                </Text>
                <TextInput
                    placeholder="Email Address"
                    style={styles.text_input_fields}
                    onChangeText={newEmail => setEmail(newEmail)}
                />
                <Button
                    title="Submit"
                    color='#b1d8b7'
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
    },
    main: {
        textAlign: "center",
        padding: Dimensions.get('window').height / 40,
        margin: Dimensions.get('window').height / 40,
        color: "black",
        fontSize: Dimensions.get('window').width / 24,
        fontFamily: "sans-serif",
    },
    text_input_fields: {
        backgroundColor: "white",
        textAlign: "center",
        padding: Dimensions.get('window').width / 40,
        fontSize: Dimensions.get('window').width / 40,
        margin: Dimensions.get('window').width / 40,
    },
    button: {
        backgroundColor: "#7094E0",
        textAlign: "center",
        justifyContent: "center"
    }
})