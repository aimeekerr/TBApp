import { React, useState } from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Modal, Pressable, Alert, Button, Dimensions, TextInput } from 'react-native';

let response;
export default function RemoveVolunteer( {navigation, route} ) {
    let key = route.params.key;
    let date = route.params.date;
    const [modalVisible, setModalVisible] = useState(false);
    const [emails, setEmails] = useState([]);
    const [email, setEmail] = useState('');

    const getEmails = async () => { 
        const request = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "key": key, 
                "date": date,
                toCollection: "clinic",
            },
        };
        try {
            let emailsRes = await fetch('http://13.59.212.26/auth/appdb/org', request).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); return myJson })
            setEmails(emailsRes);
            console.log(emails);
        } catch (error) {
            console.error("The error is", error);
        }
        // } finally {
        //     // if the user is actually in the database -> navigate to the patient info screen
        //     //navigation.navigate('ClinicScreen', {key: key, date: date});
        //     setModalVisible(true);
        // }
    }
    const deleteEmail = async () => { 
        const request = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "key": key, 
                "date": date,
                toCollection: "clinic",
                email: email,
            },
        };
        try {
            response = await fetch('http://13.59.212.26/auth/appdb/org', request).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); return myJson })
        } catch (error) {
            console.error("The error is", error);
        } finally {
            // if the user is actually in the database -> navigate to the patient info screen
            //navigation.navigate('ClinicScreen', {key: key, date: date});
            if(response == "300")
                setModalVisible(true);
            getEmails();
        }
    }
    const emailList = () => {
        return emails.map((element) => {
          return (
            <View key={element} style={{margin: 10}}>
              <Text style={styles.texts}>{element}</Text>
            </View>
          );
        });
      };
    
    return (
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
            <View>
                <Text style={styles.main}>
                    Please Enter Email Address to delete
                </Text>
                <TextInput
                    placeholder="Email Address"
                    style={styles.text_input_fields}
                    onChangeText={newEmail => setEmail(newEmail)}
                />
                <Button
                    title="Submit"
                    color='#b1d8b7'
                    onPress={deleteEmail}
                />
                <Button
                    title="Show Current Emails"
                    color='#b1d8b7'
                    onPress={getEmails}
                />
                {emailList()}
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
                        <Text style={styles.modalText}>Volunteer Email Not Found!</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                        <Text style={styles.textStyle} >Ok</Text>
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
      recorderText: {
        fontWeight: 'bold',
        textAlign: "center"
      },
      texts: {
          fontSize: Dimensions.get('window').width / 30,
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
        fontSize: Dimensions.get('window').width / 40,
        margin: Dimensions.get('window').width / 40,
    },
})