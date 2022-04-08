import { React, useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';


export default function LoginScreen( {navigation} ) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


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
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "key": "12345678", 
                "date": "12345678"
            },
            body: JSON.stringify({token: idToken}),
        };
        try {
            console.log("token id value:", idToken);
            await fetch('http://13.59.212.26/auth/appdb/med', request).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); })
        } catch (error) {
            console.error("The error is", error);
        } finally {
            // if the user is actually in the database -> navigate to the patient info screen
            navigation.navigate('VolunteerScreen');
        }
    }

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setloggedIn(false);
            setuserInfo([]);
            console.log("logged out");
        } catch (error) {
            console.error(error);
        }
    };
      
    useEffect(() => {
        GoogleSignin.configure({
          scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
          webClientId: '382563850622-mlmd0etlerlhivr31sdcuqq3ccdfg2dk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
          androidClientId:
            '382563850622-c3q3n26o8mi017qieq7ng9ifdrqivb1o.apps.googleusercontent.com', 
        });
    }, []);


    const loginPress = () => {
        console.log(email);
        console.log(password);
        navigation.navigate('VolunteerScreen');
    } 

    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.top}>
                <Image style={styles.logo} source={require("../assets/icon.png")} />
                <Text style={styles.text}>Login to begin!</Text>
            </View>
            <View style={styles.loginButtonView}>
                <View style={styles.inputsView}>
                    <TextInput
                        style={styles.inputs}
                        placeholder="Email"
                        placeholderTextColor="black"
                        onChangeText={(email) => setEmail(email)}
                    />
                    <TextInput
                        style={styles.inputs}
                        placeholder="Password"
                        placeholderTextColor="black"
                        onChangeText={(password) => setPassword(password)}
                        secureTextEntry={true}
                    />
                </View>
                <Button color="#b1d8b7" title="Login" onPress={loginPress}></Button>

                <View>
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={signIn}
                />
                </View>

                <View>
                    <Button
                    onPress={signOut}
                    title="Log Out"
                    color="red"></Button>
                </View>


                <TouchableOpacity style={styles.forgotPassword}>
                    <Text>Forgot Password?</Text>
                </TouchableOpacity>
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
    loginButtonView: {
        width: "60%",
        height: 160,
        bottom: 60,
    },
    googleButton: {
    },
    inputsView: {
        alignSelf: "center",
    },
    inputs: {
        backgroundColor: "white",
        color: "black",
        width: "100%",
        height: 40,
        bottom: 20,
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
    forgotPassword: {
        alignItems: "center",
        top: 20,
    },
})