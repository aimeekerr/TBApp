import { React } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button } from 'react-native';

export default function VolunteerScreen( {navigation} ) {
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View style={styles.buttonView}>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Add Patient Data" onPress={() => navigation.navigate('PatientInfo')}></Button>
                </View>
                <View style={styles.buttons}>
                    <Button color="#b1d8b7" title="Tutorial" onPress={() => this.selectLogin("C")}></Button>
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
        margin: 20,
        width: 200,
    },
    buttonView: {
        top: "30%",
    },
})