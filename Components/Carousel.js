import React,{useState,useEffect} from 'react';
import { View, Text, FlatList,StyleSheet,Image, Animated,Dimensions, ImageBackground } from 'react-native';

const data = [{ key: 0.6 }, { key: 1.2 }, { key: 2.4 }, { key: 1 }];
let indexes;
function Carousel(props) {
    return <View style={styles.carousel}>
        <View>
            <FlatList
            
                data={data}
                horizontal
                keyExtractor={(item, index) => 'key' + index}
                renderItem={({ item }) => {
                    return <View style={[styles.carouselitem,{marginLeft:item.key*20}]}>
                        <ImageBackground imageStyle={{borderRadius:20}} style={{width:'100%',height:'100%'}} resizeMode="cover" source={require('../assets/background.png')}/>
                    </View>
                }}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                scrollEnabled

            />
        </View>
    </View>
}

const styles=StyleSheet.create({
carouselitem:{
    width:250,
    padding:10,
    height:200,
    alignItems:"center",
    justifyContent:"center",
    alignSelf:"center",
    borderRadius:20,
    overflow:"hidden",
},
carousel:{
    height: 200,
    width: 300,
    borderRadius:20, 
},

})

export default Carousel;