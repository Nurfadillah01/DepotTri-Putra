import { View, Image, Dimensions, Animated, StatusBar } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Splash() {
    const logo = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        Animated.timing(logo, {
            toValue: -165,
            duration: 2500,
            useNativeDriver: true,
        }).start();

        return () => {
        }
    }, [])

    return (
        <View style={{ height, width, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#EEFCFF'} barStyle={'dark-content'} />
            <View style={{ height, width, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image source={require('../../assets/images/logo.png')}
                    style={{
                        height: 350, width: 350,
                        transform: [
                            {
                                translateY: logo,
                            },
                        ],
                    }}
                />
            </View>
        </View>
    )
}