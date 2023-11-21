import { View, Text, Dimensions } from 'react-native'
import React from 'react'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Penjualan() {
    return (
        <View style={{ width, height, backgroundColor: '#EEFCFF' }}>
            <Text>Penjualan</Text>
        </View>
    )
}