import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import PatientInfo from './PatientInfo';
import SymptomsScreen from './SymptomsScreen';
import UploadCough from './UploadCough';
import VolunteerScreen from './VolunteerScreen';
import LoginScreenClinic from './LoginScreenClinic';
import LoginScreenOrganization from './LoginScreenOrganization';
import ClinicScreen from './ClinicScreen';
import AddVolunteer from './AddVolunteer';
import RemoveVolunteer from './RemoveVolunteer';
import OrganizationScreen from './OrganizationScreen';
import AddClinic from './AddClinic';
import RemoveClinic from './RemoveClinic';

function LoginSelect( {navigation} ) {
    selectLogin = (selection) => {
        console.log(selection);
    }
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.top}>
                <Text style={styles.text}>Hello! Who are you?</Text>
                <Image style={styles.logo} source={require("../assets/icon.png")} />
            </View>
            <View style={styles.buttonView}>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Volunteer" onPress={() => navigation.navigate('LoginScreen')}></Button>
                </View>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Clinic" onPress={() => navigation.navigate('LoginScreenClinic')}></Button>
                </View>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Organization" onPress={() => navigation.navigate('LoginScreenOrganization')}></Button>
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
        <Stack.Screen name="LoginScreenClinic" component={LoginScreenClinic} />
        <Stack.Screen name="PatientInfo" component={PatientInfo} />
        <Stack.Screen name="SymptomsScreen" component={SymptomsScreen} />
        <Stack.Screen name="UploadCough" component={UploadCough} />
        <Stack.Screen name="VolunteerScreen" component={VolunteerScreen} />
        <Stack.Screen name="LoginScreenOrganization" component={LoginScreenOrganization} />
        <Stack.Screen name="ClinicScreen" component={ClinicScreen} />
        <Stack.Screen name="AddVolunteer" component={AddVolunteer} />
        <Stack.Screen name="RemoveVolunteer" component={RemoveVolunteer} />
        <Stack.Screen name="OrganizationScreen" component={OrganizationScreen} />
        <Stack.Screen name="AddClinic" component={AddClinic} />
        <Stack.Screen name="RemoveClinic" component={RemoveClinic} />
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
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width / 2,
    },
    top: {
        position: "absolute",
        alignItems: "center",
        top: Dimensions.get('window').height / 12,
    },
    text: {
        fontSize: Dimensions.get('window').width / 24,
        fontFamily: "sans-serif",
    },
    buttons: {
        width: Dimensions.get('window').width / 2,
        margin: Dimensions.get('window').height / 50,
    },
    buttonView: {
       top: "55%",
    },
})

export default NavStack;