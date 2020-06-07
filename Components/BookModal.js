import React,{useState,Component} from 'react';
import {View, StyleSheet, Modal} from 'react-native';

function BookModal(props){
    return <Modal visible={this.state.isActive} style={styles.container}>

    </Modal>
}
state={
    isActive = false,
};

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
    }
})