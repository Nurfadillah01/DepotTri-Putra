import { View, Text, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { Home, Login, Splash, Penjualan, Akun, PesananMasuk, Dikirim, Selesai, Produk, Pengaturan, TambahProduk, Profile, Password, User } from '../pages';

const Tab = createBottomTabNavigator()
const TopTab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function Router() {
    const [isLogin, setisLogin] = useState(null)
    const [masukBadge, setmasukBadge] = useState(0)
    const [dikirimBadge, setdikirimBadge] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            auth().onAuthStateChanged(user => {
                if (user) {
                    setisLogin(true)
                } else {
                    setisLogin(false)
                }
            })
        }, 3000);
        return () => {
            clearTimeout()
        }
    }, [])

    // useEffect(() => {
    //     const unsubscribe = database().ref('Pesanan/').on('value', snap => {
    //         snap.forEach(child => {
    //             if (child.key == 'Masuk') {
    //                 setmasukBadge(true)
    //             }
    //             if (child.key == 'Dikirim') {
    //                 setdikirimBadge(true)
    //             } else {
    //                 setdikirimBadge(false)
    //                 setmasukBadge(false)
    //             }
    //         })
    //     })

    //     return () => {
    //         unsubscribe
    //     }
    // }, [])

    const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
        const progress = Animated.add(
            current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            }),
            next
                ? next.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                })
                : 0
        );

        return {
            cardStyle: {
                transform: [
                    {
                        translateX: Animated.multiply(
                            progress.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [
                                    screen.width, // Focused, but offscreen in the beginning
                                    0, // Fully focused
                                    screen.width * -0.3, // Fully unfocused
                                ],
                                extrapolate: 'clamp',
                            }),
                            inverted
                        ),
                    },
                ],
            },
        };
    };

    const BottomTab = () => {
        return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#0077b6',
                    tabBarInactiveTintColor: '#caf0f8',
                    tabBarActiveBackgroundColor: '#caf0f8',
                    tabBarInactiveBackgroundColor: '#0077b6'
                }}
                initialRouteName='Beranda'
                // labeled={false}
                backBehavior='initialRoute'
                barStyle={{
                    backgroundColor: '#0077b6'
                }}
            >
                <Tab.Screen name='Beranda' component={Home} options={{
                    tabBarIcon: ({ color }) => (<Icon name='home' color={color} size={20} />)
                }} />
                <Tab.Screen name='Penjualan' component={TopTabMavigator} options={{
                    tabBarIcon: ({ color }) => (<Icon name='shopping-cart' color={color} size={20} />)
                }} />
                <Tab.Screen name='Pengaturan' component={Pengaturan} options={{
                    tabBarIcon: ({ color }) => (<Icon name='cog' color={color} size={20} />)
                }} />
            </Tab.Navigator>
        )
    }

    const TopTabMavigator = () => {
        return (
            <TopTab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#ffffff',
                    tabBarInactiveTintColor: '#caf0f8',
                    tabBarStyle: { height: 60, backgroundColor: '#0077b6', justifyContent: 'center' },
                    tabBarLabelStyle: { fontWeight: 'bold', textTransform: 'capitalize' },
                    tabBarIndicatorStyle: { backgroundColor: '#caf0f8', height: 30, position: 'absolute', bottom: 15, opacity: 0.3, borderRadius: 20 }
                }}
                backBehavior='initialRoute'
            >
                <TopTab.Screen name='Pesanan Masuk' component={PesananMasuk} options={{
                    // tabBarBadge: () => {
                    //     return (
                    //         <View>
                    //             {masukBadge == 0
                    //                 ? null
                    //                 : <View style={{ position: 'absolute', top: 0, right: 0, height: 20, width: 20, borderRadius: 20, backgroundColor: '#FE4964', justifyContent: 'center', alignItems: 'center' }}>
                    //                     <Text style={{ color: '#ffffff', fontSize: 12, }}>{masukBadge}</Text>
                    //                 </View>
                    //             }
                    //         </View>
                    //     )
                    // }
                }} />
                <TopTab.Screen name='Dikirim' component={Dikirim} options={{
                    // tabBarBadge: () => {
                    //     return (
                    //         <View>
                    //             {dikirimBadge == 0
                    //                 ? null
                    //                 : <View style={{ position: 'absolute', top: 0, right: 0, height: 20, width: 20, borderRadius: 20, backgroundColor: '#FE4964' }}>

                    //                 </View>
                    //             }
                    //         </View>
                    //     )
                    // }
                }} />
                <TopTab.Screen name='Selesai' component={Selesai} />
            </TopTab.Navigator>
        )
    }

    const isLoggedIn = () => {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        initialRouteName: 'BottomTab',
                        headerShown: false,
                        cardStyleInterpolator: forSlide
                    }}
                >
                    <Stack.Screen name='BottomTab' component={BottomTab} />
                    <Stack.Screen name='Produk' component={Produk} />
                    <Stack.Screen name='Akun' component={Akun} />
                    <Stack.Screen name='Tambah Produk' component={TambahProduk} />
                    <Stack.Screen name='Profile' component={Profile} />
                    <Stack.Screen name='Password' component={Password} />
                    <Stack.Screen name='User' component={User} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    const renderContent = () => {
        switch (isLogin) {
            case true:
                return isLoggedIn()
            case false:
                return <Login />

            default:
                return <Splash />
        }
    }

    return (
        renderContent()
    )
}