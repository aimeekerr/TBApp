import { React, useEffect, useState, useCallback } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Modal, Pressable, ScrollView, Alert, ImageBackground, Dimensions } from 'react-native';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from "@react-native-community/netinfo";
import { readFile, copyFile, TemporaryDirectoryPath, readDir, writeFile, unlink, DocumentDirectoryPath } from "react-native-fs";
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';
import Checkbox from 'expo-checkbox';
import DocumentPicker from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const audioRecorderPlayer = new AudioRecorderPlayer();

let base64_encoded = "";

const OFFLINE_COUGH_FILE_PREFIX = 'ekifuba_offline_cough_file_';

// Return a promise that resolves once all of the buffered files have been 
//   read, sent to the DB, and deleted from the local Android system.
export function sendBufferedCoughFiles() {
  return new Promise((resolve, reject) => {
    getBufferedCoughFiles()
      .then(contents => {
        console.info(`\n\n]=> ONLINE: Sending ${contents.length} buffered file contents!\n\n`);
        const objs = contents.map(JSON.parse);
        const fetchPromises = objs.map(o => fetch('http://13.59.212.26/db/appdb/med/users',o));
        console.info(`\n\n]=> ONLINE: Putting ${fetchPromises.length} files!\n\n`);
        Promise.all(fetchPromises)
          .then(() => {
            console.info(`\n\n]=> ONLINE: Put ${fetchPromises.length} files!\n\n`);
            return resolve(true);
          });
      })
      .catch(err => {
        console.log(`In Offline Mode: ERROR FLUSHING BUFFERED FILES: MESSAGE=${err.message}, CODE=${err.code}`);
        return resolve(false);
      })
  });
}

// Return whether <filename> string is one of our buffered cough files
export function isCoughFile(filename) {
  return filename.includes(OFFLINE_COUGH_FILE_PREFIX);
}

//////////////////////////////////////////////////////////////////////////////
// IF ONLINE => FLUSH
//////////////////////////////////////////////////////////////////////////////

// Returns a PROMISE resolving to an array of all buffered cough file's content strings.
//   => NOTE: This also DELETES the files once they're read!
//   => NOTE: This promise will REJECT if an issue getting the underlying buffered files occurs
export function getBufferedCoughFiles() {
  return new Promise((resolve, reject) => {
    // Get a list of files and directories in the "DocumentDirectoryPath" (predefined by `react-native-fs`)
    console.info(`\n\n]=> ONLINE: About to read directory: ${DocumentDirectoryPath}\n\n`);
    return readDir(DocumentDirectoryPath)
      .then(directoryContents => {
        console.info(`\n\n]=> ONLINE: Read the directory! Got ${directoryContents.length} contents!\n\n`);
        // Read the Files' Contents
        const directoryPaths = directoryContents.map(c => c.path);
        const coughFilePaths = directoryPaths.filter(isCoughFile);
        const contentPromises = coughFilePaths.map(p => readFile(p,'utf8'));
        contentPromises.push(coughFilePaths); // save the paths for deletion after reading
        console.info(`\n\n]=> ONLINE: Reading the files in the directory!\n\n`);
        return Promise.all(contentPromises);
      })
      .then(contents => {
        console.info(`\n\n]=> ONLINE: Read the ${contents.lenghth} files!\n\n`);
        // Delete the Files after Reading
        const coughFilePaths = contents.pop();
        const deletePromises = coughFilePaths.map(unlink);
        deletePromises.push(contents); // save the contents for returning after deleting
        console.info(`\n\n]=> ONLINE: Deleting the files!\n\n`);
        return Promise.all(deletePromises);
      })
      .then(contents => {
        console.info(`\n\n]=> ONLINE: Deleted the files!\n\n`);
        return resolve(contents.pop()); // return the array of read file contents
      })
      .catch(err => reject(err));
  });
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// -:- END -:- OFFLINE MODE CODE -:- END -:-
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

export function UploadCough( {route, navigation} ) {
    // retrieve and save variables from previous pages
    var key = route.params.key;
    var date = route.params.date;
    var age = route.params.age;
    var sex = route.params.sex;
    var region = route.params.region;
    var bool_symptoms = route.params.symptoms;

    const [recordPathSelected, setRecordPathSelected] = useState(true);

    const [open, setOpen] = useState(false);
    const [tuberculosis, setTuberculosis] = useState(false);
    const [items, setItems] = useState([
      {label: 'Yes', value: true},
      {label: 'No', value: false}
    ]);


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
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [audioModalVisible, setAudioModalVisible] = useState(false);

    // variable to hold the file response
    const [fileResponse, setFileResponse] = useState({});

    const [uploadedAudioUri, setUploadedAudioUri] = useState("");

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

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    // -:- START -:- OFFLINE MODE CODE -:- START -:-
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // Author: Jordan Randleman -- offline.js
    //   => Demos the use of potential code to support offline mode

    //////////////////////////////////////////////////////////////////////////////
    // RESOURCES FOR FILESYSTEM LIBRARY
    //////////////////////////////////////////////////////////////////////////////

    // Repo:           github.com/itinance/react-native-fs
    // How to install: github.com/itinance/react-native-fs#usage-iosmacos
    // How to use:     github.com/itinance/react-native-fs#examples

    //////////////////////////////////////////////////////////////////////////////
    // APPROACH
    //////////////////////////////////////////////////////////////////////////////

    /*

    Upon hitting the app's "submit" button, one of 2 things happens:

      1) We're online. The sample is sent to the DB, along with all buffered samples.
      2) We're offline. The sample is buffered.

    Buffered samples are stores as files on Android tablet. These files have a 
    prefix (the `OFFLINE_COUGH_FILE_PREFIX` constant below) followed by a number 
    suffix to differentiate them.

      * Note this implies that adding a new buffered file requires us to check the 
        largest file number suffix in order to buffer our new file with a novel 
        number (e.g. if last file has suffix N, our new one has suffix N+1).

      * Further note that "sample" here refers to the stringified JSON put requests,
        to simplify their storage and retrieval (just send what you get as the body 
        of the request without further processing).

    */

    //////////////////////////////////////////////////////////////////////////////
    // GLOBALS
    //////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////
    // HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////////////////////

    // Get the cough file's number suffix
    function getCoughFileNumber(filename) {
      return parseInt(filename.substring(filename.indexOf(OFFLINE_COUGH_FILE_PREFIX)+OFFLINE_COUGH_FILE_PREFIX.length));
    }


    // Get the next file number suffix
    function getNextCoughFileNumber(coughFiles) {
      let max = -1;
      for(coughFile of coughFiles) {
        const coughFileNumber = getCoughFileNumber(coughFile);
        if(coughFileNumber > max) {
          max = coughFileNumber;
        }
      }
      return max+1;
    }

    //////////////////////////////////////////////////////////////////////////////
    // IF OFFLINE => BUFFER SAMPLE
    //////////////////////////////////////////////////////////////////////////////

    // Returns a PROMISE that resolves to "null" if succeeded writing, or an error
    //   message if failed writing.
    function bufferCoughFile(putRequestJsonBodyString) {
      return new Promise((resolve, reject) => {
        // Get a list of files and directories in the "DocumentDirectoryPath" (predefined by `react-native-fs`)
        console.info(`\n\n]=> OFFLINE: About to read directory: ${DocumentDirectoryPath}\n\n`);
        return readDir(DocumentDirectoryPath)
          .then(directoryContents => {
            // Read the Files' Contents
            const directoryPaths = directoryContents.map(c => c.path);
            const coughFilePaths = directoryPaths.filter(isCoughFile);
            const nextCoughFileNumber = getNextCoughFileNumber(coughFilePaths);
            const newCoughFilePath = DocumentDirectoryPath + '/' + OFFLINE_COUGH_FILE_PREFIX + nextCoughFileNumber;
            console.info(`\n\n]=> OFFLINE: About to buffer filename: ${newCoughFilePath}\n\n`);
            return writeFile(newCoughFilePath, putRequestJsonBodyString, 'utf8')
              .then(() => {
                console.info(`\n\n]=> OFFLINE: Buffered the filename: ${newCoughFilePath}\n\n`);
                return resolve(null);
              })
              .catch(err => reject(err));
          });
      });
    }

    //////////////////////////////////////////////////////////////////////////////
    // CHECK IF ONLINE
    //////////////////////////////////////////////////////////////////////////////

    // Return a promise resolving to an "are we online" boolean
    function appIsOnline() {
      console.info(`\n\n]=> appIsOnline START\n\n`);
      return new Promise((resolve, reject) => {
        console.info(`\n\n]=> appIsOnline IN PROMISE\n\n`);
        return NetInfo.fetch()
          .then(response => {
            console.info(`\n\n]=> appIsOnline GOT RESPONSE, response.isConnected=${response.isConnected}\n\n`);
            return resolve(response.isConnected);
          });
      });
    }

    const print_var = () => {
      console.log("Variable is ", base64_encoded);
    }

    const changePathSelected = () => {
      setRecordPathSelected(!recordPathSelected);
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

    //modified postData to include uploaded file
    const postData = async () => {
      try {
          if(recordPathSelected) {
            var actual_path = path;
          } else {
            var actual_path = uploadedAudioUri;
          }
          console.log(recordPathSelected);
          base64_encoded = (await readFile(actual_path, 'base64')).toString()
          print_var();


          ////////////////////////////////////////////////////////////////////
          // -:- OFFLINE SUPPORT -:-
          ////////////////////////////////////////////////////////////////////

          const putData = {
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

          appIsOnline()
            .then(weAreOffline => {
              if(weAreOffline) {
                ////////////////////////////////////////////////////////////////
                // ONLINE
                ////////////////////////////////////////////////////////////////
                console.info(`\n\n]=> ONLINE: START\n\n`);
                fetch('http://13.59.212.26/db/appdb/med/users', putData)
                  .then((response) => response.json())
                  .then((myJson) => { 
                    console.log(myJson); 
                    sendBufferedCoughFiles().then(() => myJson);
                  });
              } else {
                ////////////////////////////////////////////////////////////////
                // OFFLINE
                ////////////////////////////////////////////////////////////////
                console.info(`\n\n]=> OFFLINE: START\n\n`);
                bufferCoughFile(JSON.stringify(putData))
                  .then(() => console.log(`In Offline Mode: Buffered a File!`))
                  .catch(err => console.log(`In Offline Mode: ERROR BUFFERING A FILE: MESSAGE=${err.message}, CODE=${err.code}!`));
              }
            });

          ////////////////////////////////////////////////////////////////////
          // -:- ORIGINAL VERSION (ONLY ONLINE) -:-
          ////////////////////////////////////////////////////////////////////

          // await fetch('http://13.59.212.26/db/appdb/med/users', {
          //   method: 'PUT',
          //   headers: {
          //       "Content-Type": 'application/json',
          //       "key": key, 
          //       "date": date
          //   },
          //   files: {
          //     "file": base64_encoded
          //   },
          //   body: JSON.stringify({ age: age, sex: sex, region: region, symptoms: bool_symptoms.toString(), tb: tuberculosis.toString(), file: base64_encoded }),
          // }).then((response) => { return response.json(); }).then((myJson) => { console.log(myJson); return myJson; });

          
      } catch (error) {
        console.error("The error is ", error);
      } finally {
        setConfirmationModalVisible(true);
        setModalVisible(true);
      }
    }

    const startRecordingProcess = async () => {
        setAudioModalVisible(false);
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
        // change to some type of alert??
        console.log('NO FILE HAS BEEN SELECTED')
      }
    };

    const dontSubmitInfo = () => {
      setConfirmationModalVisible(false);
    }

    const submitInfo = async () => {
      setConfirmationModalVisible(false);
      try {
        if(recordPathSelected) {
          var actual_path = path;
        } else {
          var actual_path = uploadedAudioUri;
        }
        console.log(recordPathSelected);
        base64_encoded = (await readFile(actual_path, 'base64')).toString()
        print_var();
        const putData = {
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

        appIsOnline()
          .then(weAreOffline => {
            if(weAreOffline) {
              ////////////////////////////////////////////////////////////////
              // ONLINE
              ////////////////////////////////////////////////////////////////
              console.info(`\n\n]=> ONLINE: START\n\n`);
              fetch('http://13.59.212.26/db/appdb/med/users', putData)
                .then((response) => response.json())
                .then((myJson) => { 
                  console.log(myJson); 
                  sendBufferedCoughFiles().then(() => myJson);
                });
            } else {
              ////////////////////////////////////////////////////////////////
              // OFFLINE
              ////////////////////////////////////////////////////////////////
              console.info(`\n\n]=> OFFLINE: START\n\n`);
              bufferCoughFile(JSON.stringify(putData))
                .then(() => console.log(`In Offline Mode: Buffered a File!`))
                .catch(err => console.log(`In Offline Mode: ERROR BUFFERING A FILE: MESSAGE=${err.message}, CODE=${err.code}!`));
            }
          });
      } catch (error) {
        console.error("The error is ", error);
      } finally {
        setModalVisible(true);
      }
    }

    return (
      <ScrollView>
        <ImageBackground style={styles.background} source={require("../assets/background.png")}>
        <View>
            <Text style={styles.text}>
                Select a method for uploading the patient's cough:
            </Text>

            <View style={styles.checkbox_container}>
                <Checkbox
                  value={recordPathSelected}
                  onValueChange={changePathSelected}
                  style={styles.checkbox}
                />
                <Text style={styles.checkbox_text}>
                  1) Record the patient's cough here:
                </Text>
            </View>

            <Text style={styles.recorderText}>
                {currentRecordState.recordTime}
            </Text>

            <Button
               title="Start Recording"
               color="#b1d8b7"
               onPress={() => setAudioModalVisible(true)}
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
               title="Stop Player"
               color="#b1d8b7"
               onPress={onStopPlay}
            />

            <Text style={styles.text}>
              ------- Or -------
            </Text>

            <View style={styles.checkbox_container}>
                <Checkbox
                  value={!recordPathSelected}
                  onValueChange={changePathSelected}
                  style={styles.checkbox}
                />
                <Text style={styles.checkbox_text}>
                2) Upload an existing audio file:
                </Text>
            </View>

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
            <Text style={styles.text}/>

            <Text style={styles.text}>
                Does the patient have tuberculosis?
            </Text>
            
            <DropDownPicker
              open={open}
              value={tuberculosis}
              items={items}
              setOpen={setOpen}
              setValue={setTuberculosis}
              setItems={setItems}
              dropDownDirection="TOP"
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf",
                fontSize: Dimensions.get('window').width / 24,
                position: 'absolute',
                zIndex: 900
              }}
              containerStyle={{
                margin: Dimensions.get('window').width / 40,
              }}
              labelStyle={{
                color: "#000000",
                fontSize: Dimensions.get('window').width / 24
              }}
              listItemLabelStyle={{
                color: "#000000",
                fontSize: Dimensions.get('window').width / 24,
              }}
              selectedItemLabelStyle={{
                fontWeight: "bold",
                fontSize: Dimensions.get('window').width / 24
              }}
              itemSeparator={true}
              listMode="SCROLLVIEW"
              placeholder="Select whether the patient has tuberculosis"
              placeholderStyle={{
                color: "#999999",
                textAlign: "center",
                fontSize: Dimensions.get('window').width / 24
              }}
              zIndex={1}
            />

            <Button
               title="Submit"
               color="#b1d8b7"
               onPress={() => setConfirmationModalVisible(true)}
               style={styles.submitButton}
               zIndex={5}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={audioModalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setAudioModalVisible(!audioModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Make sure to record audio in a quiet setting with no background noise!</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={startRecordingProcess}
                    >
                    <Text style={styles.textStyle} >I understand</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmationModalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setConfirmationModalVisible(!confirmationModalVisible);
                }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                          Are you sure you want to submit the form with the following information:
                          {"\n"}Age: {age}
                          {"\n"}Sex: {sex}
                          {"\n"}Region: {region}
                          {"\n"}Coughing Blood: {bool_symptoms[0].toString()}
                          {"\n"}Chest Pain: {bool_symptoms[1].toString()}
                          {"\n"}Fatigue: {bool_symptoms[2].toString()}
                          {"\n"}Fever: {bool_symptoms[3].toString()}
                          {"\n"}Pain With Breathing: {bool_symptoms[4].toString()}
                          {"\n"}Does The Patient Have Tuberculosis: {tuberculosis.toString()}
                        </Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={dontSubmitInfo}
                        >
                        <Text style={styles.textStyle}>No, go back</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={submitInfo}
                        >
                        <Text style={styles.textStyle}>Yes, submit this information</Text>
                        </Pressable>
                    </View>
                    </View>
            </Modal>
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
      </ScrollView>
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
      alignSelf: 'flex-start',
      position: 'relative',
      zIndex: 1
  },
    checkbox_container: {
        padding: Dimensions.get('window').width / 40,
        flexDirection: 'row',
        justifyContent: 'center',
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
        padding: Dimensions.get('window').width / 100,
        margin: Dimensions.get('window').width / 100,
        position: 'relative',
        zIndex: 1
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
    submitButton: {
      position: "absolute",
      zIndex: 1
    }
})