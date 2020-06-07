import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Image, ImageBackground, TouchableHighlight, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import colors from '../Components/styles/colors';
import firebase from 'firebase';
function UserPage(props) {
    const [userEmail, setUserEmail] = useState('');
    const [userMobile, setUserMobile] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [updateMobileModalVisible, setUpdateMobileModalVisible] = useState(false);
    const [updateAddressModalVisible, setUpdateAddressModalVisible] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [updatedMobile, setUpdatedMobile] = useState('');
    const [updatedAddress, setUpdatedAddress] = useState('');
    firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/Details`)
        .once('value')
        .then((child) => {
            child
                .forEach((grandchild) => {
                    grandchild
                        .forEach((ggc) => {
                            if (ggc.key == "UserEmail") {
                                setUserEmail(ggc.val())
                            }
                            if (ggc.key == "Mobile") {
                                setUserMobile(ggc.val())
                            }
                            if (ggc.key == "Address") {
                                setUserAddress(ggc.val())
                            }
                        })
                })
        })


    const [donwloadCard, setDownloadCard] = useState(false);
    const [book, setBook] = useState([]);
    if (donwloadCard == false) {
        firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/Books`).once('value').then(function (child) {
            let items = [];
            child
                .forEach((grandchild) => {
                    items.push(grandchild.val())
                    grandchild.forEach((ggc) => {
                    })
                })

            setBook(items)
        })
        setDownloadCard(true)
    }



    const a = () => {

        return <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', height: '45%' }}>

            {
                book.map(element => {
                    return <View><View style={styles.card}>
                        <ImageBackground imageStyle={{ width: '100%', height: '100%', borderRadius: 20, overflow: "hidden" }} resizeMode="stretch" source={{ uri: element.BookURI }} style={styles.cardimage} />
                        <View style={{ marginHorizontal: 10, marginTop: 5, flexDirection: "column" }}>
                            <Text style={{ fontSize: 18, marginBottom: 3 }}>{element.BookTitle}</Text>
                            <Text style={{ color: 'grey', fontSize: 12 }}>{element.BookAuthor} | {element.BookYear}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => {
                                onDelete(element.BookTitle,element.BookURI)
                            }}
                                style={{ backgroundColor: "red", padding: 10, borderRadius: 20, height: 35 }}>
                                <Text style={{ fontSize: 13, color: 'white' }}>DONATED</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    </View>
                }
                )}
        </ScrollView>
    }


    function onEdit(type) {
        if (type == 'mobile') {
            firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/Details`).once('value').then((val1) => { val1.forEach((vall) => { vall.forEach((valll) => { if (valll.key == 'Mobile') { vall.ref.update({ 'Mobile': updatedMobile }) } }) }) })
        } else if (type == 'address') {
            firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/Details`).once('value').then((val1) => { val1.forEach((vall) => { vall.forEach((valll) => { if (valll.key == 'Address') { vall.ref.update({ 'Address': updatedAddress }) } }) }) })

        }
    }

    function onDelete(value,img) {
        console.log(value)
        try{firebase.database().ref(`Books`).once('value')
            .then((val) => {
                val.forEach((vall) => {
                    vall.forEach((valll) => {
                        if (valll.val() == value) {
                            vall.ref.remove()
                        }
                    })
                })
            })
        firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/Books`).once('value')
            .then((val) => {
                val.forEach((vall) => {
                    vall.forEach((valll) => {
                        if (valll.val() == value) {
                            vall.ref.remove()
                        }
                    })
                })
            }).then(() => { setFeedbackModalVisible(true) })
            firebase.storage().refFromURL(img).delete().catch((error)=>{console.log(error)});}
            catch(error){
                console.log(error)
            }
    }


    return <View style={styles.screen}>


        {/* UPDATE MOBILE MODAL */}

        <Modal visible={updateMobileModalVisible} animationType="fade" transparent={true}>
            <TouchableWithoutFeedback onPress={() => { setUpdateMobileModalVisible(false) }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(255,255,255,0.7)' }}>
                    <View style={{ width: 300, height: 170, backgroundColor: colors.primary, borderRadius: 20, elevation: 5, padding: 20 }}>
                        <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>New Mobile No.  :</Text>
                        <TextInput onChangeText={(text) => { setUpdatedMobile(text) }} placeholder="Enter Mobile No." placeholderTextColor="rgba(255,255,255,0.5)" maxLength={10} style={{ width: '100%', borderBottomColor: 'white', borderBottomWidth: 1, fontSize: 18, color: 'white' }} />
                        <TouchableOpacity onPress={() => { onEdit('mobile'), setUpdateMobileModalVisible(false) }} style={{ backgroundColor: 'white', padding: 5, borderRadius: 10, marginVertical: 10, alignItems: "flex-end", marginTop: 20 }}>

                            <Text style={{ color: colors.primary, fontSize: 20, alignSelf: "center", textAlign: "center" }}>UPDATE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

        {/* FEEDBACK MODAL */}

        <Modal transparent={true} animationType={'fade'} visible={feedbackModalVisible}>
            <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: 300, height: 150, backgroundColor: 'white', borderRadius: 20, elevation: 5, padding: 20 }}>
                    <Text style={{ marginVertical: 5, fontSize: 20 }}>You are Amazing !!</Text>
                    <Text style={{ marginVertical: 5, fontSize: 15, color: 'grey' }}>Thank you for helping the Needies.</Text>
                    <TouchableOpacity onPress={() => { setFeedbackModalVisible(false) }} style={{ backgroundColor: colors.primary, width: '30%', alignSelf: 'flex-end', alignItems: "center", borderRadius: 10, padding: 10, marginVertical: 10 }}>
                        <Text style={{ color: 'white' }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/* UPDATE ADDRESS MODAL */}


        <Modal visible={updateAddressModalVisible} animationType="fade" transparent={true}>
            <TouchableWithoutFeedback onPress={() => { setUpdateAddressModalVisible(false) }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(255,255,255,0.7)' }}>
                    <View style={{ width: 300, height: 170, backgroundColor: colors.primary, borderRadius: 20, elevation: 5, padding: 20 }}>
                        <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>New Address :</Text>
                        <TextInput onChangeText={(text) => { setUpdatedAddress(text) }} placeholder="Enter New Address :" placeholderTextColor="rgba(255,255,255,0.5)" maxLength={60} style={{ width: '100%', borderBottomColor: 'white', borderBottomWidth: 1, fontSize: 18, color: 'white' }} />
                        <TouchableOpacity onPress={() => { onEdit('address'), setUpdateAddressModalVisible(false) }} style={{ backgroundColor: 'white', padding: 5, borderRadius: 10, marginVertical: 10, alignItems: "flex-end", marginTop: 20 }}>

                            <Text style={{ color: colors.primary, fontSize: 20, alignSelf: "center", textAlign: "center" }}>UPDATE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

        <View style={{ flexDirection: "row", justifyContent: "flex-start", width: '100%' }}>
            <View style={{ backgroundColor: 'lightgrey', height: 120, width: 120, alignItems: "center", justifyContent: "center", borderRadius: 1000, marginVertical: 20, marginHorizontal: 20 }}>
                <ImageBackground style={{ width: 80, height: 80 }} source={require('../assets/profile-icon.png')} />
            </View>
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
                <Text style={{ marginVertical: 8, fontSize: 18, width: 210, overflow: "hidden", height: 23 }}>{userEmail}</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ marginVertical: 3, fontSize: 18, color: 'grey', marginRight: 10 }}>{userMobile}</Text>
                    <TouchableOpacity onPress={() => { setUpdateMobileModalVisible(true) }}>
                        <Text style={{ color: 'royalblue', fontSize: 18 }}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginHorizontal: 60 }}>
            <Text style={{ marginVertical: 3, fontSize: 18, color: 'grey', marginRight: 10, textAlign: "justify" }}>{userAddress}</Text>
            <TouchableOpacity onPress={() => { setUpdateAddressModalVisible(true) }}>
                <Text style={{ color: 'royalblue', fontSize: 18 }}>Edit</Text>
            </TouchableOpacity>
        </View>



        <Text style={{ fontSize: 20, marginVertical: 20 }}>BOOKS TO BE DONATED -</Text>


        {a()}


        <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "row", width: '100%', alignItems: 'center', justifyContent: "space-around", marginBottom: 10, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => { firebase.auth().signOut(), props.logOut() }} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10, width: 140, alignItems: "center", elevation: 2 }}>
                    <Text style={{}}>LOG OUT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { props.goHome() }} style={{ padding: 10, backgroundColor: colors.primary, borderRadius: 10, width: 140, alignItems: "center", elevation: 2 }}>
                    <Text style={{ color: 'white' }}>GO TO HOME</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    screen: {
        alignItems: "center",
        flex: 1,
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: 'white',
        elevation: 15,
        height: '85%',
        width: '95%',
        borderRadius: 30
    },
    card: {
        margin: 10,
        width: '95%',
        height: 100,
        elevation: 4,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white',
        flexDirection: "row"
    },
    cardimage: {
        marginHorizontal: 5,
        width: '25%',
        height: '95%',
    },
})

export default UserPage;