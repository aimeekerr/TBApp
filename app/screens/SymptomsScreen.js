import { React, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, ImageBackground, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function SymptomsScreen( {route, navigation} ) {
    // retrieve and save the variables from the previous pages
    var key = route.params.key;
    var date = route.params.date;
    var age = route.params.age;
    var sex = route.params.sex;
    var region = route.params.region;

    // state variables for symptoms
   const [coughBlood, setCoughBlood] = useState(false)
   const [chestPain, setChestPain] = useState(false)
   const [fatigue, setFatigue] = useState(false)
   const [fever, setFever] = useState(false)
   const [painWithBreathing, setPainWithBreathing] = useState(false)

    const onChangeCoughBlood = () => {
        setCoughBlood(!coughBlood);
    }

    const onChangeChestPain = () => {
        setChestPain(!chestPain);
    }

    const onChangeFatigue = () => {
        setFatigue(!fatigue);
    }

    const onChangeFever = () => {
        setFever(!fever);
    }

    const onChangePainWithBreathing = () => {
        setPainWithBreathing(!painWithBreathing);
    }

   return (
    <ImageBackground style={styles.background} source={require("../assets/background.png")}>
       <View>
           <Text style={styles.text_input}>
               Check all symptoms which apply to the patient:
           </Text>
           <View>
               <View style={styles.checkbox_container}>
                    <Checkbox
                        value={coughBlood}
                        onValueChange={onChangeCoughBlood}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkbox_text}>
                        Coughing Blood
                    </Text>
                </View>
 
                <View style={styles.checkbox_container}>
                    <Checkbox
                        value={chestPain}
                        onValueChange={onChangeChestPain}
                        style={styles.checkbox}
                    />

                    <Text style={styles.checkbox_text}>
                        Chest Pain
                    </Text>
                </View>

                <View style={styles.checkbox_container}>
                    <Checkbox
                        value={fatigue}
                        onValueChange={onChangeFatigue}
                        style={styles.checkbox}
                    />

                    <Text style={styles.checkbox_text}>
                        Fatigue
                    </Text>
                </View>

                <View style={styles.checkbox_container}>
                    <Checkbox
                        value={fever}
                        onValueChange={onChangeFever}
                        style={styles.checkbox}
                    />

                    <Text style={styles.checkbox_text}>
                        Fever
                    </Text>
                </View>

                <View style={styles.checkbox_container}>
                    <Checkbox
                        value={painWithBreathing}
                        onValueChange={onChangePainWithBreathing}
                        style={styles.checkbox}
                    />

                    <Text style={styles.checkbox_text}>
                        Pain With Breathing
                    </Text>
                </View>
           </View>

           <Button
               title="Next"
               color='#b1d8b7'
               onPress={() => {
                    navigation.navigate('UploadCough', {key: key, date: date, age: age, sex: sex, region: region, symptoms: [coughBlood, chestPain, fatigue, fever, painWithBreathing]});
                }
               }
           />
       </View>
       </ImageBackground>
   )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
    },
    checkbox: {
        width: Dimensions.get('window').width / 30, 
        height: Dimensions.get('window').width / 30,
        padding: Dimensions.get('window').width / 50,
        alignSelf: 'flex-start'
    },
    checkbox_container: {
        padding: Dimensions.get('window').width / 40,
        flexDirection: 'row',
        marginLeft: Dimensions.get('window').width / 40,
    },
    checkbox_text: {
        marginBottom: Dimensions.get('window').width / 60,
        marginLeft: Dimensions.get('window').width / 60,
        fontSize: Dimensions.get('window').width / 40,
        justifyContent: 'center'
    },
    container: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    text_input: {
        fontSize: Dimensions.get('window').width / 30,
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: Dimensions.get('window').width / 40,
        margin: Dimensions.get('window').width / 40
    }
})