import React, { Component, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, KeyboardAvoidingView, Modal, Button,TouchableHighlight, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import GeneralStatusBarColor from './Components/GeneralStatusBarColor';
import MainScreen from './Screens/MainScreen';
import Header from './Components/Header';
import * as firebase from 'firebase';
import LoginPage from './Screens/LoginPage';
import UserPage from './Screens/UserPage';
const firebaseConfig = {
  apiKey: "AIzaSyCV4Neo5qXiHaVNf9Ba8RLqWsUu6TdZ6e8",
  authDomain: "donatebooks-6099c.firebaseapp.com",
  databaseURL: "https://donatebooks-6099c.firebaseio.com",
  projectId: "donatebooks-6099c",
  storageBucket: "donatebooks-6099c.appspot.com",
  
}

// Required for side-effects



if(!firebase.apps.length){firebase.initializeApp(firebaseConfig)}else{ firebase.app();}
function App() {
  const [isLogin,setIsLogin] = useState(false);
  const [headerShow,setsetHeaderShow] = useState(false);
  const [mainShow,setMainShow] = useState(true);
  const [showMainPage,setShowMainPage] = useState(false);
  
  let header;
  let screen = <LoginPage check={()=>{setIsLogin(true)}}/>;
  if(isLogin==true){
    if(mainShow){screen=<MainScreen/>}
else{
  screen=<UserPage logOut={()=>{setIsLogin(false),setMainShow(true)}} goHome={()=>{setMainShow(true)}}/>
}

  header=<Header toUser={()=>{setMainShow(false)}}/>
}
else{
  screen=<LoginPage check={()=>{setIsLogin(true)}}/>;
}
    return (
      <>
        <SafeAreaView>
          <GeneralStatusBarColor backgroundColor="#2196f3"
            barStyle="light-content" />
        </SafeAreaView>
        <View style={styles.main}>
      <ImageBackground source={require('./assets/background.png')} style={{flex:1,width:'100%',alignItems:"center"}}>
          {header}
          {screen}
        </ImageBackground>
        </View>
      </>
    );
  };




const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    
  }
});

export default App;
