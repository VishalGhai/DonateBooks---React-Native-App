import React from 'react';
import {Text,View,Image , StyleSheet, TouchableWithoutFeedback} from 'react-native';
import * as firebase from 'firebase';
function Header(props){
return <View style={styles.container}>
    <Image source={require('../assets/book-icon.png')} style={{height:35,width:35}}/>
    <Text style={styles.heading}>Donate Books</Text>
    <View style={{alignItems:"flex-end",flex:1,width:'100%'}}>
        <TouchableWithoutFeedback onPress={()=>{props.toUser()}}>
    <Image source={require('../assets/profile-icon.png')} style={{height:30,width:30,marginHorizontal:10}}/>
    </TouchableWithoutFeedback>
    </View>
</View>;
}

const styles=StyleSheet.create({
container:{
    width:'100%',
    flexDirection:"row",
    padding:20,
    paddingLeft:20,
},
heading:{
    fontSize:25,
    color:'white',
    
    paddingLeft:15,
    
}
});

export default Header;