import { React, useState } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LoginScreen( {navigation} ) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signInAsync = async() => {
        console.log("Login Screen");

        const config = {
            issuer: 'https://accounts.google.com',
            clientId: `382563850622-c3q3n26o8mi017qieq7ng9ifdrqivb1o.apps.googleusercontent.com`,
            redirectUrl: "com.android.ekifubatest.auth://",
            scopes: ["profile", "email"],
          };

        try {
            const result = await authorize(config);
            console.log(result);

        } catch (error) {
            console.log("Error with logging in", error);
        }
    };

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
                <View style={styles.inputsVie}>
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
                <FontAwesome5.Button style={styles.googleButton} backgroundColor="white" name="google" color="green" onPress={signInAsync}>
                <Text style={styles.googleText}>Log In With Google</Text>
                </FontAwesome5.Button>
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
    inputsView: {
        bottom: 20,
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