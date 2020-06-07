import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, ColorPropType, TouchableWithoutFeedback, Keyboard, Modal, TouchableNativeFeedback, KeyboardAvoidingView, ImageBackground, ToastAndroid,YellowBox } from 'react-native';
import * as firebase from 'firebase';

YellowBox.ignoreWarnings(['Setting a timer']);
function LoginPage(props) {
    const [incorrectModal, setIncorrectModal] = useState(false);
    const [modalHead, setModalHead] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [signupmodal, setsignupmodal] = useState(false);
    const [logedin, setLogedin] = useState(false);
    const [check, setCheck] = useState(false);


    let alph = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{4,}/;
    let passchk = /^[a-zA-Z0-9]/;
    let spacechk = /\s/;
    let mobilechk = /[0-9]/;

    function Validate(text, type) {
        if (type == 'username') {
            if (alph.test(text) || spacechk.test(text)) {
                setModalHead('Incorrect Email');
                setModalContent('Please enter a valid email.');
                setIncorrectModal(true);
                console.log(!alph.test(text))
            }
            setUsername(text);
        }

        if (type == 'pass') {
            if (!passchk.test(text) || spacechk.test(text)) {
                setModalHead('Incorrect Password');
                setModalContent('Password must contain atleast one alphabet and one number.');
                setIncorrectModal(true);
            }
            setPassword(text);
        }

        if (type == 'mobile') {
            if (!mobilechk.test(text)) {
                setModalHead('Incorrect Contact no.');
                setModalContent('Please enter a valid Mobile no.');
                setIncorrectModal(true);
            }
            setMobile(text);
        }

        if (type == 'address') {
            setAddress(text);
        }
    }


    function SignUpFinal() {

        if (username == '') {
            setModalHead('Incorrect Email');
            setModalContent('Please enter a valid email.');
            setIncorrectModal(true);
        }
        else if (password == '') {
            setModalHead('Incorrect Password');
            setModalContent('Password must contain atleast one alphabet and one number.');
            setIncorrectModal(true);
        }
        else if (mobile == '') {
            setModalHead('Incorrect Contact no.');
            setModalContent('Please enter a valid Mobile no.');
            setIncorrectModal(true);
        }
        else if (address == '') {
            setModalHead('Incorrect Address');
            setModalContent('Please enter Your Valid Address.');
            setIncorrectModal(true);
        }
        else {
            firebase.auth().createUserWithEmailAndPassword(username, password)
                .then(function () {
                    setsignupmodal(false);
                    setModalHead('Successfully Signed Up !');
                    setModalContent('Thank you !');
                    setIncorrectModal(true);
                    Keyboard.dismiss();
                }).then(
                    () => {
                        firebase.database().ref('/Users/'+firebase.auth().currentUser.uid+'/Details')
                            .push({
                                "UserId": firebase.auth().currentUser.uid,
                                "UserEmail": firebase.auth().currentUser.email,
                                "Mobile":mobile,
                                "Address":address
                            });
                    }
                )
                .catch(error => {
                    console.log(error);
                    console.log(username);
                    if (error == 'Error: Password should be at least 6 characters') {
                        setModalHead('Error while Signing Up !');
                        setModalContent('Password must contain minimum 6 letters. ');
                        setIncorrectModal(true);
                    }
                    else if (error == 'Error: The email address is already in use by another account.') {
                        setModalHead('Error while Signing Up !');
                        setModalContent('Username already exists. ');
                        setIncorrectModal(true);
                    }
                    else {
                        setModalHead('Error while Logging In !');
                        setModalContent('Incorrect Email or Password');
                        setIncorrectModal(true);
                    }
                });
        }
    }

    const { currentUser } = firebase.auth();

    function login() {
        try {
            firebase.auth().signInWithEmailAndPassword(username, password)
                .then(function () { setLogedin(true) })
                .catch(error => {
                    setLogedin(false);
                    if (error == 'Error: The email address is badly formatted.') {
                        setModalHead('Error while Logging In !');
                        setModalContent('Incorrect Username or Password');
                        setIncorrectModal(true)
                    } else if (error == 'Error: There is no user record corresponding to this identifier. The user may have been deleted.') {
                        setModalHead('Error while Logging In !');
                        setModalContent('No user of such name is found. Please register or tap on forgot password.');
                        setIncorrectModal(true)
                    }
                }).then(function () {
                    console.log(logedin);
                });
        } catch (error) {
            console.log("wrong password");

        }
        Keyboard.dismiss();
    }

    function SignUpPage() {
        setsignupmodal(true);
    }

    function reset() {
        console.log(username)
        firebase.auth().sendPasswordResetEmail(username).catch(error => {
            if (error == 'Error: The email address is badly formatted.') {
                setModalHead('Error Occured !');
                setModalContent('Please enter your correct email above.');
                setIncorrectModal(true)
            }
        })
    }

    if (logedin == true) {
        ToastAndroid.show("Loged in", ToastAndroid.SHORT);
        props.check();
    }
    return <KeyboardAvoidingView>

        {/* ALERT VIEW MODAL */}

        <Modal visible={incorrectModal} animationType={"fade"} transparent={true}>
            <View style={styles.modal}>
                <Text style={{ fontSize: 20 }}>{modalHead}</Text>
                <Text style={{ fontSize: 15, color: 'grey', marginTop: 10 }}>{modalContent}</Text>
                <TouchableNativeFeedback onPress={() => { setIncorrectModal(false) }} style={{ flex: 1, flexDirection: "column-reverse", width: 30, height: 15, padding: 5 }}>
                    <Text style={{ alignSelf: "flex-end", marginTop: 30, fontSize: 20 }}>OKAY!</Text>
                </TouchableNativeFeedback>
            </View>
        </Modal>


        {/* SIGN UP MODAL */}

        <Modal visible={signupmodal} animationType={"fade"} transparent={true}>
            <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(f,f,f,0.6)' }}>
                <View style={{ marginTop: '20%', backgroundColor: 'white', marginHorizontal: '5%', borderRadius: 20, elevation: 10, height: '67%' }}>
                    <ImageBackground source={require('../assets/background.png')} style={{ width: '100%', height: '100%', alignItems: "center", justifyContent: "center" }} imageStyle={{ borderRadius: 20 }}>
                        <Text style={{ fontSize: 40, color: 'white', paddingVertical: 10, fontWeight: "bold" }}>SIGN UP</Text>

                        <TextInput autoCapitalize={"none"} onChangeText={(text) => Validate(text, 'username')} style={styles.inputs} placeholderTextColor="grey" placeholder="Enter Email" />

                        <TextInput onChangeText={(text) => Validate(text, 'pass')} autoCapitalize={"none"} style={styles.inputs} secureTextEntry placeholderTextColor="grey" placeholder="Enter Password" />
                        <TextInput autoCapitalize={"none"} maxLength={10} keyboardType="number-pad" onChangeText={(text) => Validate(text, 'mobile')} style={styles.inputs} placeholderTextColor="grey" placeholder="Enter Contact no." />
                        <TextInput autoCapitalize={"none"} onChangeText={(text) => Validate(text, 'address')} multiline style={[styles.inputs, { maxHeight: 80, fontSize: 15, paddingVertical: 5 }]} placeholderTextColor="grey" placeholder="Enter Your Permanent Address" />
                        <View style={{ flexDirection: "row" }}>

                            <TouchableOpacity onPress={SignUpFinal} style={[styles.signupbtn, { backgroundColor: '#4dabf6' }]}><Text style={{ fontSize: 25, fontWeight: "bold", color: 'white' }}>SIGNUP</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setsignupmodal(false) }} style={[styles.signupbtn, { backgroundColor: 'white' }]}><Text style={{ fontSize: 20, fontWeight: "bold" }}>CANCEL</Text></TouchableOpacity>
                        </View>

                    </ImageBackground>
                </View>
            </View>
        </Modal>


        <View style={{ width: '100%', alignItems: "center", marginTop: '20%' }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Image source={require('../assets/book-icon.png')} style={{ height: 100, width: 100 }} />
                <View style={{ marginLeft: 20, justifyContent: "center" }}>
                    <Text style={{ fontSize: 25, color: 'white' }}>Donate</Text>
                    <Text style={{ fontSize: 20, color: 'white' }}> Books</Text></View>

            </View>

            <TextInput onChangeText={(text) => { setUsername(text) }} autoCapitalize={"none"} style={styles.input} placeholderTextColor="white" placeholder="Enter Email" />

            <TextInput onChangeText={(text) => { setPassword(text) }} autoCapitalize={"none"} style={styles.input} secureTextEntry placeholderTextColor="white" placeholder="Enter Password" />

            <TouchableOpacity onPress={() => { login() }} style={styles.loginbtn}><Text style={{ fontSize: 25, fontWeight: "bold" }}>LOGIN</Text></TouchableOpacity>

            <Text style={{ color: 'white', marginBottom: -25, marginTop: 35 }}>Haven't Signed Up yet !?</Text>

            <TouchableOpacity onPress={SignUpPage} style={[styles.loginbtn, { backgroundColor: '#4dabf6' }]}><Text style={{ fontSize: 25, fontWeight: "bold" }}>SIGNUP</Text></TouchableOpacity>

            <Text style={{ color: 'white', marginBottom: -25, marginTop: 35, fontSize: 16 }}>Having problem in Signing In !?</Text>

            <TouchableOpacity onPress={reset} style={[styles.loginbtn, { backgroundColor: '#4dabf6', width: 250 }]}><Text style={{ fontSize: 20, fontWeight: "bold", color: 'white' }}>FORGOT PASSWORD</Text></TouchableOpacity>
        </View>
    </KeyboardAvoidingView >
}
const styles = StyleSheet.create({
    input: {
        width: 300,
        height: 50,
        borderRadius: 20,
        marginVertical: 15,
        borderColor: 'white',
        borderWidth: 2,
        paddingHorizontal: 20,
        color: 'white',
        fontSize: 20,
        backgroundColor: '#4dabf6',
        elevation: 2
    },
    inputs: {
        width: 300,
        height: 50,
        borderRadius: 20,
        marginVertical: 15,
        borderColor: 'lightgrey',
        borderWidth: 2,
        paddingHorizontal: 20,
        color: 'darkgrey',
        fontSize: 20,
        backgroundColor: 'white',
        elevation: 2
    },
    loginbtn: {
        width: 150,
        height: 45,
        marginTop: 30,
        backgroundColor: 'white',
        alignItems: "center",
        borderRadius: 20,
        elevation: 10,
        justifyContent: "center"
    },
    modal: {
        alignSelf: "center",
        marginTop: '70%',
        backgroundColor: 'white',
        padding: 20,
        width: 300,
        borderRadius: 20,
        elevation: 10
    },
    signupbtn: {
        width: 120,
        height: 45,
        marginTop: 30,
        alignItems: "center",
        borderRadius: 20,
        elevation: 10,
        marginHorizontal: 10,
        justifyContent: "center"
    }
})

export default LoginPage;