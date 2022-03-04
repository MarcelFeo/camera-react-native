import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';

import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  },[]);

  if(hasPermission === null) {
    return <View />;
  }

  if(hasPermission === false) {
    return <Text>Acesso negado!</Text>;
  }

  const takePicture = async () => {
    if(camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Camera 
        style={{ flex: 1 }}
        type={type}
        ref={camRef}
      >
        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
          <TouchableOpacity 
            style={{position: 'absolute', bottom: 20, left: 20}}
            onPress={() => {
              type === 'back' ? setType('front') : setType('back')
            }}
          >
            <MaterialIcons name="flip-camera-ios" size={35} color="#ff304f" />
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity 
        style={styles.button}
        onPress={takePicture}
      >
        <Feather name="circle" size={48} color="#ff304f" />
      </TouchableOpacity>

      { capturedPhoto && 
        <Modal 
          animationType="slide"
          transparent={false}
          visible={open}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 20,
            }}
          >
            <TouchableOpacity 
              style={{ margin: 10 }}
              onPress={() => setOpen(false)}
            >
              <MaterialCommunityIcons name="window-close" size={24} color="#ff304f" />
            </TouchableOpacity>

            <Image 
              style={{
                width: '100%',
                height: 300,
                borderRadius: 20,
              }}
              source={{ uri: capturedPhoto }}
            />

          </View>
        </Modal>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  }
});
