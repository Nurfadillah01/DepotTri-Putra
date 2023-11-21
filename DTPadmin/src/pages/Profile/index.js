import { View, Text, StatusBar, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import database from '@react-native-firebase/database'

import Icon from 'react-native-vector-icons/FontAwesome5'

export default function Profile({ navigation }) {
    const [nama, setnama] = useState('')
    const [namaUsaha, setnamaUsaha] = useState('')
    const [alamat, setalamat] = useState('')
    const [alamatUsaha, setalamatUsaha] = useState('')

    useEffect(() => {
        database().ref(`Admin/Profile`).once('value', snap => {
            if (snap.val() == null) {
                null
            } else {
                setnama(snap.val().nama)
                setnamaUsaha(snap.val().nama)
                setalamat(snap.val().alamat)
                setalamatUsaha(snap.val().alamat)
            }
        })

        return () => {
        }
    }, [])

    const saveHandle = () => {
        Alert.alert('', 'Ubah data?', [
            { text: 'Batal' },
            {
                text: 'Ya', onPress: () => {
                    database().ref(`Admin/Profile/`).set({
                        nama, alamat
                    }).then(() => {
                        Alert.alert('', 'Data berhasil disimpan', [
                            {
                                text: 'Ok', onPress: () => navigation.goBack()
                            },
                        ]);
                    })
                }
            },
        ]);
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>Profil</Text>
                <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }} />
            </View>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text>Nama Usaha</Text>
                    <TextInput
                        placeholder='Masukkan nama usaha'
                        autoCapitalize='words'
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 20 }}
                        value={nama}
                        onChangeText={setnama}
                    />
                    <Text>Alamat</Text>
                    <TextInput
                        placeholder='Masukkan alamat usaha'
                        autoCapitalize='words'
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 20 }}
                        value={alamat}
                        onChangeText={setalamat}
                    />
                </View>
                {nama == namaUsaha && alamat == alamatUsaha
                    ? <View
                        style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3, opacity: 0.5 }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Ubah</Text>
                    </View>
                    : <TouchableOpacity
                        style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}
                        onPress={() => saveHandle()}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Ubah</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}