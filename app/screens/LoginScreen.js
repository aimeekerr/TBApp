import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, TextInput } from 'react-native';

function LoginScreen(props) {
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
                    />
                    <TextInput
                        style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                </View>
                <Button color="#b1d8b7" title="Login"></Button>
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
    }
})

export default LoginScreen;