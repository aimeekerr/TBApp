import { React, useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Alert } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';


export default function LoginScreenOrganization( {navigation} ) {
    // adding google authentication here
    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);
    let tokenId = "";

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();
            console.log('Your id token is', idToken);
            setloggedIn(true);
            getInfo(idToken);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log('Cancel');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('PLAY_SERVICES_NOT_AVAILABLE');
                // play services not available or outdated
            } else {
                // some other error happened
                console.log(error);
            }
        }
    };


    const getInfo = async (idToken) => {
        const request = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "key": "12345678", 
                "date": "12345678"
            },
            body: JSON.stringify({token: idToken}),
        };
        try {
            console.log("token id value:", idToken);
            let response_list = await fetch('http://13.59.212.26/auth/appdb/org', request).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); return myJson; })
            console.log(response_list)
            if(response_list != null)
            {
                let key = response_list[0];
                let date = response_list[1];
                navigation.navigate('OrganizationScreen', {key: key, date: date});
            }
            else
            {
                Alert.alert(
                    "Alert",
                    "Email does not have permission.",
                )
            }
        } catch (error) {
            console.error("The error is", error);
        } 
    } 
      
    useEffect(() => {
        GoogleSignin.configure({
          scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
          webClientId: '382563850622-mlmd0etlerlhivr31sdcuqq3ccdfg2dk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
          androidClientId:
            '382563850622-c3q3n26o8mi017qieq7ng9ifdrqivb1o.apps.googleusercontent.com', 
        });
    }, []); 

    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.top}>
                <Image style={styles.logo} source={require("../assets/icon.png")} />
                <Text style={styles.text}>Hello Organization, Login to begin!</Text>
            </View>
                <View>
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={signIn}
                />
                </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    googleButton: {
    },
    logo: {
        width: 200,
        height: 200,
        position: "absolute",
    },
    top: {
        position: "absolute",
        top: 70,
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        fontFamily: "sans-serif",
    },
})