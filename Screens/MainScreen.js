import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, YellowBox, Modal, InteractionManager, ImageBackground, Linking, Keyboard, TouchableNativeFeedback, ListView, FlatList, TouchableWithoutFeedback } from 'react-native';
import Carousel from '../Components/Carousel';
import colors from '../Components/styles/colors';
import * as firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

function MainScreen(props) {
    const [bookModalVisible, setBookModalVisible] = useState(false);
    const [donateBookImage, setDonaeBookImage] = useState(false);
    const [donateBookModalVisible, setDonateBookModalVisible] = useState(false);
    const [donateCallModal, setDonateCallModal] = useState(false);
    const [downloaded, setDownloaded] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [heightModal, setHeightModal] = useState('60%');
    const [modalHead, setModalHead] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [incorrectModal, setIncorrectModal] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);

    YellowBox.ignoreWarnings([
        'Remote debugger is in a background tab which may cause apps to perform slowly',
        'Require cycle: node_modules/rn-fetch-blob/index.js',
        'Require cycle: node_modules/react-native/Libraries/Network/fetch.js'


    ]);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setHeightModal('90%')
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setHeightModal('60%')
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    let donateBookView;

    if (donateBookImage) {
        donateBookView = <ImageBackground imageStyle={{ borderRadius: 20, overflow: "hidden" }} source={{ uri: downloaded }} style={{ width: '100%', height: '100%' }} />
    } else {
        donateBookView = <View>
            <TouchableOpacity style={{ padding: 10, backgroundColor: 'lightgrey', borderRadius: 20 }} onPress={() => {
                if (bookTitle == '') {
                    setModalHead("Wrong Details !!")
                    setModalContent("Please enter book title first.")
                    setIncorrectModal(true)
                } else {
                    _uploadFile()
                }
            }}>
                <Text style={{ color: 'white' }}>Add Image</Text>
            </TouchableOpacity>
        </View>
    }


    let currentUserId = firebase.auth().currentUser.uid;

    const ref = firebase.storage().ref(currentUserId);
    if (bookTitle != '') {
    }
    function showImage() {
        setLoadingVisible(true);
        const imageref = firebase.storage().ref(`${currentUserId}`).child(`${bookTitle}.jpeg`);
        imageref.getDownloadURL().then(function (url) {
            setDownloaded(url);
        }).catch(function (error) {
            console.log(error)
        })
        setTimeout(()=>{setLoadingVisible(false)},3000)
    }


    const uploadImage = async (blob) => {
        return new Promise(async (resolve, reject) => {
            ref.child("-" + currentUserId + ".jpeg");

            const task = await firebase.storage().ref(`${currentUserId}`).child(`${bookTitle}.jpeg`).put(blob);
            // task.on(
            //     firebase.storage.TaskEvent.STATE_CHANGED,
            //     snapshot =>
            //     error => {
            //         console.log("error", error);
            //     },
            //     result => {
            //         console.log("result : "+result)
            //         return resolve({
            //             url: task.snapshot.downloadURL,
            //             contentType: task.snapshot.metadata.contentType,
            //             name: task.snapshot.metadata.name,
            //             size: task.snapshot.metadata.size
            //         });
            //     }
            // );
            showImage()
            setDonaeBookImage(true)

        })
    }

    const getImageAsBlob = () => {
        return new Promise((resolve, reject) => {
            ImagePicker.showImagePicker({}, response => {
                fetch(response.uri)
                    .then(response2 => {
                        return response2.blob();
                    })
                    .then(
                        blob => {
                            return resolve(blob);
                        },
                        error => {
                            return resolve(error);
                        }
                    );
            });
        });
    };

    const _uploadFile = async () => {
        try {
            const blob = await getImageAsBlob();
            console.log("got blob", blob);
            const uploadResults = await uploadImage(blob);
            console.log(donateBookImage)
            console.log("uploaded blob", uploadResults);

        } catch (e) {
            console.log(e)
            alert("_uploadFile", JSON.stringify(e));
        }
    };

    const [bookTitle, setBookTitle] = useState('');
    const [bookYear, setBookYear] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');


    console.log("donwload:" + downloaded)
    async function submitDonateBook() {

        console.log("downloaded : " + downloaded)
        if (bookAuthor == '' || bookYear == '' || bookTitle == '' || downloaded == '') {

            setModalHead("Wrong Details !!")
            setModalContent("Please enter valid book details.")
            setIncorrectModal(true)
        } else {
            firebase.database().ref(`Users/${currentUserId}/Books`).push({ "BookTitle": bookTitle, "BookYear": bookYear, "BookAuthor": bookAuthor, "BookURI": downloaded })
            firebase.database().ref(`Books`).push({ "BookTitle": bookTitle, "BookYear": bookYear, "BookAuthor": bookAuthor, "BookURI": downloaded, "BookOwner": currentUserId })
                .then(() => {
                    setDonateBookModalVisible(false)
                    setModalHead("Hip Hip Hurray !")
                    setModalContent("Thank You for helping the nation.")
                    setIncorrectModal(true)
                }).then(() => {


                })
        }

    }
    const [bookTitleShow, setBookTitleShow] = useState('');
    const [bookYearShow, setBookYearShow] = useState('');
    const [bookAuthorShow, setBookAuthorShow] = useState('');
    const [bookUIDShow, setBookUIDShow] = useState('');
    const [bookImageShow, setBookImageShow] = useState('');

    const [downloadCard, setDownloadCard] = useState(false);
    const [book, setBook] = useState([]);
    if (downloadCard == false) {
        firebase.database().ref(`Books`).once('value').then(function (child) {
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
    const [mobile, setMobile] = useState('')

    firebase.database().ref(`Users/${bookUIDShow}/Details`).once('value').then((child) => { child.forEach((grandchild) => { grandchild.forEach((ggc) => { if (ggc.key == 'Mobile') { setMobile(ggc.val()) } }) }) }).then(() => { setBookUIDShow('') })


    const sendOnWhatsApp = () => {

        // let msg = this.state.msg;
        // let mobile = this.state.mobile_no;
        if (mobile) {
            //   if(msg){
            let url = 'whatsapp://send?text=Hello, from DonateBooks. I want to get ' + bookTitleShow + ' book you are willing to donate. &phone=91' + mobile;
            Linking.openURL(url).then((data) => {
            }).catch(() => {
                alert('Make sure Whatsapp installed on your device');
            });
        } else {
            alert('Please insert message to send');
        }
        // }else{
        //   alert('Please insert mobile no');
        // }
    }

    const dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${' + mobile + '}';
        }
        else {
            phoneNumber = 'telprompt:${' + mobile + '}';
        }

        Linking.openURL(phoneNumber);
    };
    const [searchText, setSearchText] = useState('');
    const a = () => {

        return book.map(element => {
            if (searchText == '') {
                return <View><View onPress={props.onCardClick} style={styles.card}>
                    <ImageBackground imageStyle={{ width: '100%', height: '100%', borderRadius: 20, overflow: "hidden" }} resizeMode="stretch" source={{ uri: element.BookURI }} style={styles.cardimage} />
                    <View style={{ marginHorizontal: 10, marginTop: 5, flexDirection: "column" }}>
                        <Text style={{ fontSize: 18, marginBottom: 3 }}>{element.BookTitle}</Text>
                        <Text style={{ color: 'grey', fontSize: 12 }}>{element.BookAuthor} | {element.BookYear}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => {
                            setBookTitleShow(element.BookTitle),
                                setBookAuthorShow(element.BookAuthor),
                                setBookYearShow(element.BookYear),
                                setBookImageShow(element.BookURI),
                                setBookUIDShow(element.BookOwner),
                                setBookModalVisible(!bookModalVisible)
                        }}
                            style={{ backgroundColor: colors.primary, padding: 8, borderRadius: 15, height: 30, width:90 }}>
                            <Text style={{ fontSize: 11, color: 'white' }}>WANT BOOK</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                </View>
            } else {
                if (element.BookTitle.includes(searchText)) {
                    return <View><View onPress={props.onCardClick} style={styles.card}>
                        <ImageBackground imageStyle={{ width: '100%', height: '100%', borderRadius: 20, overflow: "hidden" }} resizeMode="stretch" source={{ uri: element.BookURI }} style={styles.cardimage} />
                        <View style={{ marginHorizontal: 10, marginTop: 5, flexDirection: "column" }}>
                            <Text style={{ fontSize: 18, marginBottom: 3 }}>{element.BookTitle}</Text>
                            <Text style={{ color: 'grey', fontSize: 12 }}>{element.BookAuthor} | {element.BookYear}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => {
                                setBookTitleShow(element.BookTitle),
                                    setBookAuthorShow(element.BookAuthor),
                                    setBookYearShow(element.BookYear),
                                    setBookImageShow(element.BookURI),
                                    setBookUIDShow(element.BookOwner),
                                    setBookModalVisible(!bookModalVisible)
                            }}
                                style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 20, height: 35 }}>
                                <Text style={{ fontSize: 11, color: 'white' }}>WANT BOOK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    </View>
                }
            }
        })
    }

    function Search() {

        book.filter((element) => {


        })


    }

    return <KeyboardAvoidingView style={styles.screen}>
        <TextInput onChangeText={(text) => { setSearchText(text) }} placeholder="Search books.." style={styles.searchbar} />

        {/* DONATE CALL MODAL */}
        {Search()}
        <Modal visible={donateCallModal} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={() => { setDonateCallModal(false) }}>
                <View style={{ backgroundColor: 'rgba(100,100,100,0.2)', justifyContent: "center", flex: 1 }}>
                    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: 'white', paddingHorizontal: 20, width: 300, alignSelf: "center", elevation: 5, borderRadius: 20 }} >
                        <TouchableNativeFeedback onPress={() => { sendOnWhatsApp() }}><Text style={{ marginVertical: 20, fontSize: 18 }}>WhatsApp At +91 {mobile}</Text></TouchableNativeFeedback>
                        <View style={{ borderWidth: 1, width: '99%', borderColor: 'lightgrey' }}></View>
                        <TouchableNativeFeedback onPress={() => { dialCall() }}><Text style={{ marginVertical: 20, fontSize: 18 }}>Call At +91 {mobile}</Text></TouchableNativeFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

        <Modal visible={loadingVisible} transparent={true}>
            <View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:'rgba(255,255,255,.3)'}}>
                <Image style={{ width: 50, height: 50 }} source={require('../assets/loading.gif')} />
            </View>
        </Modal>


        {/* ALERT VIEW MODAL */}

        <Modal visible={incorrectModal} animationType={"fade"} transparent={true}>
            <View style={styles.modal}>
                <Text style={{ fontSize: 20 }}>{modalHead}</Text>
                <Text style={{ fontSize: 15, color: 'grey', marginTop: 10 }}>{modalContent}</Text>
                <TouchableNativeFeedback onPress={() => { setIncorrectModal(false) }}
                    style={{ flex: 1, flexDirection: "column-reverse", width: 30, height: 15, padding: 5 }}>
                    <Text style={{ alignSelf: "flex-end", marginTop: 30, fontSize: 20 }}>OKAY!</Text>
                </TouchableNativeFeedback>
            </View>
        </Modal>

        {/* BOOK CARD CONTAINER */}



        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }} style={styles.cardcontainer}>

            {/* <View>{book.map(child=>child.map((child)=>{return <Text>{child}</Text>}))}</View> */}

            {/* BOOK MODAL */}
            {a()}



            <Modal visible={bookModalVisible} animationType="fade" transparent={true} style={{ backgroundColor: 'black' }}>
                <View style={{ margin: 50, marginVertical: '30%', alignItems: "center", alignSelf: "center", backgroundColor: 'white', padding: 20, elevation: 10, borderRadius: 20, height: '60%' }}>
                    <ImageBackground source={{ uri: bookImageShow }} style={{ width: '98%', height: '50%', alignSelf: "flex-start" }} imageStyle={{ borderRadius: 20, overflow: "hidden", height: '100%', width: '100%' }} />
                    <Text style={{ fontSize: 25, marginVertical: 20 }}>{bookTitleShow}</Text>
                    <Text style={{ color: 'grey', fontSize: 20 }}>{bookYearShow} | {bookAuthorShow}</Text>
                    <View style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                        <TouchableOpacity onPress={() => { setBookModalVisible(false) }} style={[styles.btn, { backgroundColor: 'white' }]}><Text style={{}}>CLOSE</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setDonateCallModal(true) }} style={[styles.btn, { backgroundColor: colors.primary, width: 80 }]}><Text style={{ color: 'white' }}>GET</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* DOANTE BOOK MODAL */}

            <Modal visible={donateBookModalVisible} animationType="fade" transparent={true} style={{ backgroundColor: 'black' }}>
                <View style={{ margin: 50, marginVertical: '30%', alignItems: "center", alignSelf: "center", backgroundColor: 'white', padding: 20, elevation: 10, borderRadius: 20, height: heightModal }}>
                    <View style={styles.imagescontainer}>
                        {donateBookView}
                    </View>
                    <TextInput onChangeText={(text) => { setBookTitle(text) }} style={{ fontSize: 20, marginTop: 5, borderBottomColor: colors.primary, borderBottomWidth: 2, width: 200 }} placeholder="Enter Book Title" />
                    <TextInput onChangeText={(text) => { setBookYear(text) }} keyboardType="number-pad" style={{ fontSize: 20, marginTop: 5, borderBottomColor: colors.primary, borderBottomWidth: 2, width: 200 }} placeholder="Enter Book Year" />
                    <TextInput onChangeText={(text) => { setBookAuthor(text) }} style={{ fontSize: 20, marginTop: 5, borderBottomColor: colors.primary, borderBottomWidth: 2, width: 200 }} placeholder="Enter Book Author" />
                    <View style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                        <TouchableOpacity onPress={() => { setDonateBookModalVisible(false), setDownloaded(''), setDonaeBookImage(false) }} style={[styles.btn, { backgroundColor: 'white' }]}><Text style={{}}>CLOSE</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { submitDonateBook().then(() => { setDownloaded(''), setDonaeBookImage(false), setDownloadCard(false) }) }} style={[styles.btn, { backgroundColor: colors.primary }]}><Text style={{ color: 'white' }}>DONATE</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </ScrollView>

        <TouchableOpacity onPress={() => { setDonateBookModalVisible(true) }} style={styles.donatebutton}>
            <Text style={{ fontSize: 25, color: 'white' }}>DONATE A BOOK</Text>
        </TouchableOpacity>

    </KeyboardAvoidingView>
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
        borderRadius: 30,
    },
    searchbar: {
        width: '90%',
        margin: '4%',
        height: '8%',
        backgroundColor: 'white',
        elevation: 3,
        paddingHorizontal: 20,
        borderRadius: 30,
        fontSize: 18,
    },
    donatebutton: {
        width: '90%',
        margin: '4%',
        height: 50,
        elevation: 5,
        borderRadius: 30,
        backgroundColor: 'black',
        alignItems: "center",
        justifyContent: "center",
    },
    cardcontainer: {
        flex: 10,
        width: '95%',
    },
    card: {
        margin: 20,
        width: '95%',
        height: 100,
        elevation: 4,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white',
        flexDirection: "row"
    },
    cardimage: {
        borderRadius: 20,
        overflow: "hidden",
        marginHorizontal: 5,
        width: '25%',
        height: '100%',
    },
    btn: {
        padding: 10,
        alignItems: "center",
        borderRadius: 20,
        alignSelf: "flex-end",
        elevation: 3
    },
    imagescontainer: {
        width: 230,
        height: '25%',
        borderWidth: 1,
        flex: 1,
        borderRadius: 20,
        alignItems: "center",
        padding: 10,
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
})

export default MainScreen;