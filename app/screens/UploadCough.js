import { React, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Modal, Pressable, Alert, ImageBackground } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function UploadCough( {route, navigation} ) {
    // retrieve and save variables from previous page
    var age = route.params.age;
    var sex = route.params.sex;
    var region = route.params.region;
    var bool_symptoms = route.params.symptoms;

    const [modalVisible, setModalVisible] = useState(false);

    // state variable that represents whether the patient has tuberculosis
    const [tuberculosis, setTuberculosis] = useState(false)

    const onChangeTuberculosis = () => {
        setTuberculosis(!tuberculosis);
    }

    const request = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "key": "12345678", 
            "date": "12345678"
        },
        body: JSON.stringify({ age: age, sex: sex, region: region, symptoms: bool_symptoms.toString(), tb: tuberculosis.toString() }),
    };
    const getData = async () => {
        try {
            await fetch('http://3.15.172.132:80/db/appdb/med/users/0', request);
        } catch (error) {
            console.error(error);
        } finally {
            setModalVisible(true);
        }
    }

    const onChangeSubmit = () => {
        console.log(`Age: ${age}`);
        console.log(`Sex: ${sex}`);
        console.log(`Region: ${region}`);
        console.log(`Symptoms: ${bool_symptoms}`);
        console.log(`Tuberculosis?: ${tuberculosis}`);
        // Make API call to upload data to the database
        getData();
        console.log("loading");
    }

    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
        <View>
            <Text style={styles.text}>
                Please upload an audio file of the patient's cough
            </Text>

            <Text style={styles.text}>
                Does the patient have tuberculosis?
            </Text>

            <View style={styles.checkbox_container}>
                <Checkbox
                    value={tuberculosis}
                    onValueChange={onChangeTuberculosis}
                    style={styles.checkbox}
                />

                <Text style={styles.checkbox_text}>
                    Yes
                </Text>
            </View>

            <Button
               title="Submit"
               color="#b1d8b7"
               onPress={onChangeSubmit}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Patient Information Successfully Uploaded!</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => navigation.navigate('VolunteerScreen')}
                    >
                    <Text style={styles.textStyle} >Return to Home</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center'
    },
    checkbox: {
        width: 25, 
        height: 25,
        padding: 5,
        alignSelf: 'center'
    },
    checkbox_container: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkbox_text: {
        marginBottom: 8,
        marginLeft: 5
    },
    text: {
        backgroundColor: "#85CBB5",
        textAlign: "center",
        padding: 10,
        margin: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonClose: {
        backgroundColor: "#b1d8b7",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
})
