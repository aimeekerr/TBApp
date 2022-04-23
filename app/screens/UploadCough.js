import { React, useEffect, useState, useCallback } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Modal, Pressable, Alert, ImageBackground, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { readFile, copyFile, TemporaryDirectoryPath } from "react-native-fs";
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';
import DocumentPicker, { types } from 'react-native-document-picker';

const audioRecorderPlayer = new AudioRecorderPlayer();

let base64_encoded = "";

export default function UploadCough( {route, navigation} ) {
    // retrieve and save variables from previous pages
    var key = route.params.key;
    var date = route.params.date;
    var age = route.params.age;
    var sex = route.params.sex;
    var region = route.params.region;
    var bool_symptoms = route.params.symptoms;

    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.CacheDir}/testing.wav`,
    });
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const [currentRecordState, setCurrentRecordState] = useState({
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',});
    const [modalVisible, setModalVisible] = useState(false);

    // variable to hold the file response
    const [fileResponse, setFileResponse] = useState({});

    const [uploadedAudioUri, setUploadedAudioUri] = useState("");

    // state variable that represents whether the patient has tuberculosis
    const [tuberculosis, setTuberculosis] = useState(false)

    const onChangeTuberculosis = () => {
      setTuberculosis(!tuberculosis);
    }

    const request = {
      method: 'PUT',
      headers: {
          "Content-Type": 'application/json',
          "key": key, 
          "date": date
      },
      files: {
        "file": base64_encoded
      },
      body: JSON.stringify({ age: age, sex: sex, region: region, symptoms: bool_symptoms.toString(), tb: tuberculosis.toString(), file: base64_encoded }),
    };

    const print_var = () => {
      console.log("Variable is ", base64_encoded);
    }

    const getData = async () => {
      try {
          base64_encoded = (await readFile(path, 'base64')).toString()
          print_var();
          await fetch('http://13.59.212.26/db/appdb/med/users', {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
                "key": key, 
                "date": date
            },
            files: {
              "file": base64_encoded
            },
            body: JSON.stringify({ age: age, sex: sex, region: region, symptoms: bool_symptoms.toString(), tb: tuberculosis.toString(), file: base64_encoded }),
          }).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); return myJson; });
      } catch (error) {
          console.error("The error is ", error);
      } finally {
          setModalVisible(true);
      }
    }

    const onStartRecord = async () => {
        if (Platform.OS === 'android') {
            try {
              const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
              ]);
          
              console.log('write external stroage', grants);
          
              if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                  PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                  PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.RECORD_AUDIO'] ===
                  PermissionsAndroid.RESULTS.GRANTED
              ) {
                console.log('Permissions granted');
              } else {
                console.log('All required permissions not granted');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
        }

        const result = await audioRecorderPlayer.startRecorder(path, audioSet, false);
        audioRecorderPlayer.addRecordBackListener((e) => {
            setCurrentRecordState({ ...currentRecordState, 
            recordSecs: e.currentPosition,
            recordTime: audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition),
            ),
          });
          return;
        });
        console.log(result);
      };
      
    const onStopRecord = async () => {
      let result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setCurrentRecordState({ ...currentRecordState,
        recordSecs: 0,
      });
      console.log(result);
    };
      
    // "file:///data/user/0/com.android.ekifubatest/files/testing.wav"
    // file:///data/user/0/com.android.ekifubatest/cache/42
    // content://com.android.providers.downloads.documents/document/42

    const onStartPlay = async () => {
      console.log('onStartPlay');
      const msg = await audioRecorderPlayer.startPlayer(path);
      console.log("The message is", msg);
      audioRecorderPlayer.setVolume(1.0);
      audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.currentPosition === e.duration) {
              console.log('finished');
              audioRecorderPlayer.stopPlayer();
          }
          setCurrentRecordState({ ...currentRecordState,
              currentPositionSec: e.currentPosition,
              currentDurationSec: e.duration,
              playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
              duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
          });
          return;
      });
    };
      
    const onPausePlay = async () => {
      await audioRecorderPlayer.pausePlayer();
    };
      
    const onStopPlay = async () => {
      console.log('onStopPlay');
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };

    //type: [types.wav, types.mp3, types.aac],
    const handleDocumentSelection = useCallback(async () => {
      try {
        const response = await DocumentPicker.pickSingle({
          presentationStyle: 'fullscreen',
          type: ['audio/wav', 'audio.mpeg', 'audio/aac'],
        });
        setFileResponse(response);
        setUploadedAudioUri((await get_uri(response.uri)).toString());
      } catch (error) {
        console.log(error);
      }
    }, []);

    const get_uri = async(url) => {
      if (url.startsWith('content://')) {
        console.log('url passed in is', url);
        const urlComponents = url.split('/')
        const fileNameAndExtension = urlComponents[urlComponents.length - 1]
        const destPath = `${TemporaryDirectoryPath}/${fileNameAndExtension}`
        console.log('destpath', destPath);
        await copyFile(url, destPath);
        console.log('dest path is'+  "file://" + destPath.toString());
        return "file://" + destPath.toString();
      }
    }

    const onStartPlayUploadedRecording = async () => {
      console.log('onStartPlay');
      console.log('Contents in uploadedAudioUri', uploadedAudioUri);
      // Object.keys(fileResponse).length > 0
      if (uploadedAudioUri) {
        const msg = await audioRecorderPlayer.startPlayer(uploadedAudioUri);
        console.log("The message is", msg);
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
                console.log('finished');
                audioRecorderPlayer.stopPlayer();
            }
            setCurrentRecordState({ ...currentRecordState,
                currentPositionSec: e.currentPosition,
                currentDurationSec: e.duration,
                playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
            });
            return;
        });
      } else {
        console.log('NO FILE HAS BEEN SELECTED')
      }
    };

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

            <Text style={styles.recorderText}>
                {currentRecordState.recordTime}
            </Text>

            <Button
               title="Start Recording"
               color="#b1d8b7"
               onPress={onStartRecord}
            />
            <Button
               title="Stop Recording"
               color="#b1d8b7"
               onPress={onStopRecord}
            />

            <Text style={styles.recorderText}>
                {currentRecordState.playTime} / {currentRecordState.duration}
            </Text>

            <Button
               title="Start Player"
               color="#b1d8b7"
               onPress={onStartPlay}
            />

            <Button
               title="Pause"
               color="#b1d8b7"
               onPress={onPausePlay}
            />

            <Button
               title="Stop Player"
               color="#b1d8b7"
               onPress={onStopPlay}
            />

            <Text style={styles.text}>
              ------- Or -------
            </Text>

            <Text style={styles.text}>
              Upload an audio file of the patient's cough
            </Text>

            <View>
              <Button
                title="Select Audio File"
                color="#b1d8b7"
                onPress={handleDocumentSelection}
              />
              <Button
               title="Play Back Audio"
               color="#b1d8b7"
               onPress={onStartPlayUploadedRecording}
            />

            </View>

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
               onPress={getData}
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
                        onPress={() => navigation.navigate('VolunteerScreen', {key: key, date: date})}
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
      width: Dimensions.get('window').width / 16, 
      height: Dimensions.get('window').width / 16,
      padding: Dimensions.get('window').width / 50,
      alignSelf: 'flex-start'
  },
    checkbox_container: {
        padding: Dimensions.get('window').width / 40,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkbox_text: {
      marginBottom: Dimensions.get('window').width / 60,
      marginLeft: Dimensions.get('window').width / 60,
      fontSize: Dimensions.get('window').width / 24,
      justifyContent: 'center'
    },
    text: {
        fontSize: Dimensions.get('window').width / 20,
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: Dimensions.get('window').width / 70,
        margin: Dimensions.get('window').width / 70
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
