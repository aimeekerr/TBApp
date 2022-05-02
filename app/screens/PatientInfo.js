import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, ImageBackground, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function PatientInfo ( {route, navigation} ) {
    var key = route.params.key;
    var date = route.params.date;
    const [age, setAge] = useState(0);
    const [region, setRegion] = useState('');

    const [open, setOpen] = useState(false);
    const [sex, setSex] = useState(null);
    const [items, setItems] = useState([
      {label: "Male", value: "M"},
      {label: "Female", value: "F"}
    ]);

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
           <DropDownPicker
              open={open}
              value={sex}
              items={items}
              setOpen={setOpen}
              setValue={setSex}
              setItems={setItems}
              dropDownDirection="BOTTOM"
              disableBorderRadius={true}
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf",
                fontSize: Dimensions.get('window').width / 24
              }}
              labelStyle={{
                color: "#404040",
                fontSize: Dimensions.get('window').width / 24,
                textAlign: "center",
                padding: Dimensions.get('window').width / 70,
                margin: Dimensions.get('window').width / 70
              }}
              listItemLabelStyle={{
                color: "#000000",
                fontSize: Dimensions.get('window').width / 24
              }}
              placeholder="Sex"
              placeholderStyle={{
                color: "#999999",
                textAlign: "center",
                padding: Dimensions.get('window').width / 70,
                fontSize: Dimensions.get('window').width / 24,
                margin: Dimensions.get('window').width / 70
              }}
              selectedItemLabelStyle={{
                fontWeight: "bold",
                fontSize: Dimensions.get('window').width / 24
              }}
              onSelectItem={(item) => {
                console.log(item);
              }}
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
                   console.log(sex);
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
       fontSize: Dimensions.get('window').width / 24,
       margin: Dimensions.get('window').width / 40,
   },
   button: {
       backgroundColor: "#7094E0",
       textAlign: "center",
       justifyContent: "center"
   }
})
 