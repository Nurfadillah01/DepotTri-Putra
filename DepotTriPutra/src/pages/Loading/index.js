import { View, Text, Image, StatusBar } from 'react-native'
import React from 'react'

export default function Loading() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />
            <View style={{
                height: 150, width: 150, borderRadius: 20, shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
            }}>
                <Image source={require('../../assets/Logo_w.png')} style={{ resizeMode: 'contain', height: 150, width: 150, borderRadius: 20 }} />
            </View>
        </View>
    )
}