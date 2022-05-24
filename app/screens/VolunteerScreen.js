import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button, Dimensions } from 'react-native';
import { sendBufferedCoughFiles } from './UploadCough';

export default function VolunteerScreen( {route, navigation} ) {
    var key = route.params.key;
    var date = route.params.date;

    const submitRequests = () => {
        console.log('Jordan code to submit remaining requests');
        sendBufferedCoughFiles();
    }

    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.buttonView}>
                <View style={styles.mbutton}>
                    <Button color="#b1d8b7"  title="Add Patient Data" onPress={() => navigation.navigate('PatientInfo', {key: key, date: date})}></Button>
                </View>
                <View style={styles.mbutton}>
                    <Button color="#b1d8b7" title="Submit Remaining Requests" onPress={submitRequests}></Button>
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
    mbutton: {
        width: Dimensions.get('window').width / 2,
        margin: Dimensions.get('window').height / 50,
    },
})