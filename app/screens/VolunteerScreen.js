import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, Dimensions } from 'react-native';

export default function VolunteerScreen( {route, navigation} ) {
    var key = route.params.key;
    var date = route.params.date;
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.buttonView}>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Add Patient Data" onPress={() => navigation.navigate('PatientInfo', {key: key, date: date})}></Button>
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