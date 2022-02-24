import { React, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function UploadCough( {route, navigation} ) {
    // retrieve and save variables from previous page
    var age = route.params.age;
    var sex = route.params.sex;
    var region = route.params.region;
    var bool_symptoms = route.params.symptoms;

    // state variable that represents whether the patient has tuberculosis
    const [tuberculosis, setTuberculosis] = useState(false)

    const onChangeTuberculosis = () => {
        setTuberculosis(!tuberculosis);
    }

    const onChangeSubmit = () => {
        console.log(`Age: ${age}`);
        console.log(`Sex: ${sex}`);
        console.log(`Region: ${region}`);
        console.log(`Symptoms: ${bool_symptoms}`);
        console.log(`Tuberculosis?: ${tuberculosis}`);
        // Make API call to upload data to the database
    }

    return (
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
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
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
    }
})
