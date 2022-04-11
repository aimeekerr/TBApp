import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, Dimensions } from 'react-native';

export default function ClinicScreen( {route, navigation} ) {
    let key = route.params.key;
    let date = route.params.date;
    //let idToken = route.params.idToken;
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.buttonView}>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Add Volunteer" onPress={() => navigation.navigate('AddVolunteer',{key: key, date: date})}></Button>
                </View>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Remove Volunteer" onPress={() => navigation.navigate("RemoveVolunteer",{key: key, date: date})}></Button>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
    },
    buttons: {
        width: Dimensions.get('window').width / 2,
        margin: Dimensions.get('window').height / 50,
    },
    buttonView: {
        top: "30%",
    },
})