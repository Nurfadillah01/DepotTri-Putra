import { View, StatusBar, Dimensions, Text, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import auth from '@react-native-firebase/auth'

import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/FontAwesome5'

import { Akun, Beranda, Diterima, Keranjang, Loading, Login, Menunggu, Pesanan, Register, Selesai } from '../pages'

const Stack = createStackNavigator()
const TabBottom = createMaterialBottomTabNavigator()
const TabTop = createMaterialTopTabNavigator()

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

export default function Router() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            auth().onAuthStateChanged(user => {
                if (user) {
                    setUser(true)
                } else {
                    setUser(false)
                }
            })
        }, 3000);
        return () => {
            clearTimeout()
        }
    }, [])

    const PesananTab = () => {
        return (
            <TabTop.Navigator
                initialRouteName='Keranjang'
                screenOptions={{
                    backBehavior: 'initialRoute',
                    tabBarLabelStyle: { textTransform: 'capitalize' },
                    tabBarActiveTintColor: '#02D4BA',
                    tabBarInactiveTintColor: '#8F8F8F',
                    tabBarIndicatorStyle: { backgroundColor: '#02D4BA' },
                    tabBarShowIcon: true,
                    tabBarStyle: { backgroundColor: '#f0f0f0' }
                }}
            >
                <TabTop.Screen name='Keranjang' component={Keranjang}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <Icons name='shopping-cart' color={color} size={16} />
                        )
                    }}
                />
                <TabTop.Screen name='Menunggu' component={Menunggu} />
                <TabTop.Screen name='Dikirim' component={Diterima} />
                <TabTop.Screen name='Selesai' component={Selesai} />
            </TabTop.Navigator>
        )
    }

    const Menu = () => {
        return (
            <TabBottom.Navigator
                initialRouteName='Beranda'
                screenOptions={{
                    backBehavior: 'initialRoute',
                }}
                activeColor="#02D4BA"
                inactiveColor='#8F8F8F'
                barStyle={{ backgroundColor: '#f0f0f0', height: 70, elevation: 5 }}
            >
                <TabBottom.Screen
                    name="Home"
                    component={Beranda}
                    options={{
                        tabBarLabel: 'Beranda',
                        tabBarIcon: ({ color }) => (
                            <Icon name="home" color={color} size={26} />
                        )
                    }}
                />
                <TabBottom.Screen
                    name="Pesanan"
                    component={PesananTab}
                    options={{
                        tabBarLabel: 'Pesanan',
                        tabBarIcon: ({ color }) => (
                            <Icon name="backpack" color={color} size={26} />
                        )
                    }}
                />
                <TabBottom.Screen
                    name="AkunSaya"
                    component={Akun}
                    options={{
                        tabBarLabel: 'Akun',
                        tabBarIcon: ({ color }) => (
                            <Icon name="person" color={color} size={26} />
                        )
                    }}
                />
            </TabBottom.Navigator>
        )
    }

    const LoggedIn = () => {
        return (
            <Stack.Navigator
                initialRouteName='Menu'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name='Menu' component={Menu} />
            </Stack.Navigator>
        )
    }

    const LoggedOut = () => {
        return (
            <Stack.Navigator
                initialRouteName='Login'
                screenOptions={{
                    headerShown: true, headerStyle: { backgroundColor: '#f0f0f0' }
                }}
            >
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Register' component={Register} />
            </Stack.Navigator>
        )
    }

    const renderContent = () => {
        switch (user) {
            case true:
                return <LoggedIn />

            case false:
                return <LoggedOut />

            default:
                return <Loading />

        }
    }

    return (
        <NavigationContainer>
            {renderContent()}
        </NavigationContainer>
    )
}