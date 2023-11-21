import { View, Text, StatusBar, TouchableOpacity, FlatList, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'
import database from '@react-native-firebase/database'

import Icon from 'react-native-vector-icons/FontAwesome5'

export default function User({ navigation }) {
    const [data, setdata] = useState([])

    useEffect(() => {
        const unsubscribe = database().ref('User/Account/').on('value', snap => {
            if (snap.val() == null) {
                null
            } else {
                let dataArr = []
                snap.forEach(child => {
                    child.forEach(item => {
                        if (item.key == 'Profile') {
                            dataArr.push({
                                key: child.key,
                                nama: item.val().nama,
                                email: item.val().email,
                                status: item.val().status
                            })
                        }
                    })
                    setdata(dataArr)
                })
            }
        })
        return () => {
            unsubscribe
        }
    }, [])

    const toggleSwitch = (item) => {
        const stat = item.status
        database().ref(`User/Account/${item.key}/Profile/`).update({
            status: !stat
        })
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#0077b6'} />
            <View style={{ height: 60, backgroundColor: '#0077b6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon name='chevron-left' size={16} color='#ffffff' />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>Pengguna</Text>
                <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }} />
            </View>
            {data == ''
                ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Kosong</Text>
                </View>
                : <View style={{ flex: 1, padding: 20 }}>
                    <FlatList
                        data={data}
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    onPress={() => visibleHandle(item)}
                                    key={item.key}
                                    style={{ height: 60, backgroundColor: '#ffffff', elevation: 3, borderRadius: 10, margin: 5, flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ marginLeft: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000000' }}>{item.nama}</Text>
                                            <Text>{item.email}</Text>
                                        </View>
                                    </View>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                                        thumbColor={item.status ? '#81b0ff' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleSwitch(item)}
                                        value={item.status}
                                    />
                                </View>
                            )
                        }}
                    />
                </View>
            }
        </View>
    )
}