import { React, useState } from 'react';
import { ImageBackground, View, StyleSheet, Text, Button, Dimensions, TextInput, Modal, Pressable, Alert, } from 'react-native';

export default function AddVolunteer( {navigation, route} ) {
    let key = route.params.key;
    let date = route.params.date;
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const getInfo = async () => {
        console.log(email);
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "key": key, 
                "date": date
            },
            body: JSON.stringify({emails: [ email ], fromCollection: "org", toCollection: "clinic" }),
        };
        try {
            await fetch('http://13.59.212.26/auth/appdb/org', request).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); })
        } catch (error) {
            console.error("The error is", error);
        } finally {
            // if the user is actually in the database -> navigate to the patient info screen
            //navigation.navigate('ClinicScreen', {key: key, date: date});
            setModalVisible(true);
        }
    }

    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View>
                <Text style={styles.main}>
                    Please Enter New Clinic's Email Address
                </Text>
                <TextInput
                    placeholder="Email Address"
                    style={styles.text_input_fields}
                    onChangeText={newEmail => setEmail(newEmail)}
                />
                <Button
                    title="Submit"
                    color='#b1d8b7'
                    onPress={getInfo}
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
                        <Text style={styles.modalText}>Clinic Successfully Added!</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => navigation.navigate('OrganizationScreen', {key: key, date: date})}
                        >
                        <Text style={styles.textStyle} >Return to Home</Text>
                        </Pressable>
                    </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
    },
    main: {
        textAlign: "center",
        padding: Dimensions.get('window').height / 40,
        margin: Dimensions.get('window').height / 40,
        color: "black",
        fontSize: Dimensions.get('window').width / 24,
        fontFamily: "sans-serif",
    },
    text_input_fields: {
        backgroundColor: "white",
        textAlign: "center",
        padding: Dimensions.get('window').width / 40,
        fontSize: Dimensions.get('window').width / 24,
        margin: Dimensions.get('window').width / 40,
    },
    button: {
        backgroundColor: "#7094E0",
        textAlign: "center",
        justifyContent: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Dimensions.get('window').width / 22
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
      recorderText: {
        fontWeight: 'bold',
        textAlign: "center"
      },
})