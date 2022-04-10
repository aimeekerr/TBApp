import { React, useState } from 'react';
import { ImageBackground, View, StyleSheet, Text, Button, Dimensions, TextInput } from 'react-native';

export default function AddVolunteer( {navigation, route} ) {
    let key = route.params.key;
    let date = route.params.date;
    const [email, setEmail] = useState('');

    const getInfo = async () => {
        console.log(email);
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "key": key, 
                "date": date
            },
            body: JSON.stringify({emails: [ email ], fromCollection: clinic, toCollection: med }),
        };
        try {
            console.log("token id value:", idToken);
            await fetch('http://13.59.212.26/auth/appdb/med', request).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); })
        } catch (error) {
            console.error("The error is", error);
        } finally {
            // if the user is actually in the database -> navigate to the patient info screen
            navigation.navigate('ClinicScreen');
        }
    }

    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View>
                <Text style={styles.main}>
                    Please Enter New Volunteer's Email Address
                </Text>
                <TextInput
                    placeholder="Email Address"
                    style={styles.text_input_fields}
                    onChangeText={newEmail => setEmail(newEmail)}
                />
                <Button
                    title="Submit"
                    color='#b1d8b7'
                    onPress={getInfo}
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