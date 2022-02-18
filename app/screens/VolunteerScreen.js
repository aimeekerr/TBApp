import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Checkbox from 'expo-checkbox';
 
function VolunteerScreen(props) {
   const [patient_age, set_patient_age] = useState(0)
   const [patient_sex, set_patient_sex] = useState('')
   const [patient_region, set_patient_region] = useState('')
 
   // state variables for symptoms
   const [coughBlood, setCoughBlood] = useState(false)
   const [chestPain, setChestPain] = useState(false)
   const [fatigue, setFatigue] = useState(false)
   const [fever, setFever] = useState(false)
   const [painWithBreathing, setPainWithBreathing] = useState(false)
 
   // state variable that represents whether the patient has tuberculosis
   const [tuberculosis, setTuberculosis] = useState(false)
 
   return (
       <View>
           <Text style={styles.main}>
               Please Enter the Patient's Information
           </Text>
           <TextInput
               placeholder="Age"
               style={styles.text_input_fields}
               onChangeText={newAge => set_patient_age(newAge)}
           />
           <TextInput
               placeholder="Sex"
               style={styles.text_input_fields}
               onChangeText={newSex => set_patient_age(newSex)}
           />
           <TextInput
               placeholder="Region"
               style={styles.text_input_fields}
               onChangeText={newRegion => set_patient_age(newRegion)}
           />
 
           <Text style={styles.text_input}>
               Symptoms:
           </Text>
 
           <View style={styles.checkbox}>
               <Checkbox
                   value={coughBlood}
                   onValueChange={setCoughBlood}
                   style={styles.checkbox}
               />
 
               <Checkbox
                   value={chestPain}
                   onValueChange={setChestPain}
                   style={styles.checkbox}
               />
 
               <Checkbox
                   value={fatigue}
                   onValueChange={setFatigue}
                   style={styles.checkbox}
               />
 
               <Checkbox
                   value={fever}
                   onValueChange={setFever}
                   style={styles.checkbox}
               />
           </View>
 
           <Text style={styles.text_input}>
               Does the patient have tuberculosis?
           </Text>
 
           <Button
               title="Submit"
               onPress={() => {
                   set_patient_age(0);
                   set_patient_age('')
                   set_patient_age('')}
               }
           />
       </View>
   );
}
 
const styles = StyleSheet.create({
   background: {
       flex: 1,
       justifyContent: 'flex-end',
       alignItems: 'center',
   },
   main: {
       backgroundColor: "#70E0B8",
       textAlign: "center",
       padding: 15,
       margin: 10
   },
   text_input_fields: {
       backgroundColor: "#D6E2E0",
       textAlign: "center",
       padding: 15,
       margin: 10
   },
   text_input: {
       textAlign: "center",
       padding: 10,
       margin: 10
   },
   button: {
       backgroundColor: "#7094E0",
       textAlign: "center",
       justifyContent: "center"
   },
   checkbox: {
       margin: 8,
       padding: 1,
       flexDirection: 'row',
       justifyContent: "space-between",
       alignItems: "center"
   }
})
 
export default VolunteerScreen;