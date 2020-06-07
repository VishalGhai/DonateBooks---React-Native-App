import React from 'react';
import { View,Text} from 'react-native';

function CarouselItem({props}) {
    return <View style={{ height: 200, width: 200, borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: 'white', marginHorizontal: 20 }}>
            {props.key}
        </Text>
    </View>
}

export default CarouselItem;