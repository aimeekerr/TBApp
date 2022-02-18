import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import VolunteerScreen from './VolunteerScreen';

function LoginSelect( {navigation} ) {
    selectLogin = (selection) => {
        console.log(selection);
    }
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.top}>
                <Image style={styles.logo} source={require("../assets/icon.png")} />
                <Text style={styles.text}>Hello! Who are you?</Text>
            </View>
            <View style={styles.buttonView}>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Volunteer" onPress={() => navigation.navigate('LoginScreen')}></Button>
                </View>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Clinic" onPress={() => this.selectLogin("C")}></Button>
                </View>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Admin" onPress={() => this.selectLogin("A")}></Button>
                </View>
            </View>
        </ImageBackground>
    );
}

const Stack = createNativeStackNavigator();

function NavStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginSelect} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="VScreen" component={VolunteerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        position: "absolute",
    },
    top: {
        position: "absolute",
        top: 70,
    },
    text: {
        fontSize: 20,
        fontFamily: "sans-serif",
    },
    buttons: {
        margin: 10,
    },
    buttonView: {
        top: "50%",
    },
})

export default NavStack;