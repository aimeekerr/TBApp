import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, ImageBackground, Dimensions } from 'react-native';
 
export default function PatientInfo ( {route, navigation} ) {
    var key = route.params.key;
    var date = route.params.date;
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState('');
    const [region, setRegion] = useState('');

   return (
    <ImageBackground style={styles.background} source={require("../assets/background.png")}>
       <View>
           <Text style={styles.main}>
               Please Enter the Patient's Information
           </Text>
           <TextInput
               placeholder="Age"
               style={styles.text_input_fields}
               onChangeText={newAge => setAge(newAge)}
           />
           <TextInput
               placeholder="Sex"
               style={styles.text_input_fields}
               onChangeText={newSex => setSex(newSex)}
           />
           <TextInput
               placeholder="Region"
               style={styles.text_input_fields}
               onChangeText={newRegion => setRegion(newRegion)}
           />
 
           <Button
               title="Next"
               color='#b1d8b7'
               onPress={() => {
                    navigation.navigate('SymptomsScreen', {key: key, date: date, age: age, sex: sex, region: region});
               }}
           />
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
       fontSize: Dimensions.get('window').width / 40,
       margin: Dimensions.get('window').width / 40,
   },
   button: {
       backgroundColor: "#7094E0",
       textAlign: "center",
       justifyContent: "center"
   }
})
 