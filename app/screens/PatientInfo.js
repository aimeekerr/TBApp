import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, ImageBackground } from 'react-native';
 
export default function PatientInfo ( {navigation} ) {
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
                    navigation.navigate('SymptomsScreen', {age: age, sex: sex, region: region});
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
       padding: 15,
       margin: 10,
       color: "black",
       fontSize: 20,
        fontFamily: "sans-serif",
   },
   text_input_fields: {
       backgroundColor: "white",
       textAlign: "center",
       padding: 15,
       margin: 10,
   },
   button: {
       backgroundColor: "#7094E0",
       textAlign: "center",
       justifyContent: "center"
   }
})
 