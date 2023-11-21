import { View, Text, StatusBar, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'

import Icon from 'react-native-vector-icons/FontAwesome5'

export default function Password({ navigation }) {
    const [password, setpassword] = useState('')
    const [newPass, setnewPass] = useState('')
    const [konfPass, setkonfPass] = useState('')

    const reauthenticate = (password) => {
        var user = auth().currentUser;
        var cred = auth().EmailAuthProvider.credential(
            user.email, password);
        return user.reauthenticateWithCredential(cred);
    }

    const saveHandle = (password, newPass) => {
        auth().sendPasswordResetEmail('depotputra20@gmail.com')
        // Alert.alert('', 'Ubah data?', [
        //     { text: 'Batal' },
        //     {
        //         text: 'Ya', onPress: () => {
        //             reauthenticate(password).then(() => {
        //                 var user = auth().currentUser;
        //                 user.updatePassword(newPass).then(() => {
        //                     Alert.alert('', 'Berhasil', [
        //                         { text: 'Ok', onPress: () => navigation.goBack() }
        //                     ]);
        //                 }).catch((error) => {
        //                     Alert.alert('', 'Gagal', [
        //                         { text: 'Ok' }
        //                     ]);
        //                 });
        //             }).catch((error) => {
        //                 Alert.alert('', 'Gagal', [
        //                     { text: 'Ok' }
        //                 ]);
        //             });
        //         }
        //     },
        // ]);
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>Keamanan</Text>
                <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }} />
            </View>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text>Kata Sandi Lama</Text>
                    <TextInput
                        placeholder='Sandi lama'
                        secureTextEntry
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 20 }}
                        value={password}
                        onChangeText={setpassword}
                    />
                    <Text>Kata Sandi Baru</Text>
                    <TextInput
                        placeholder='Sandi baru'
                        secureTextEntry
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 20 }}
                        value={newPass}
                        onChangeText={setnewPass}
                    />
                    <Text>Konfirmasi Kata Sandi</Text>
                    <TextInput
                        placeholder='Konfirmasi sandi'
                        secureTextEntry
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 20 }}
                        value={konfPass}
                        onChangeText={setkonfPass}
                    />
                </View>
                {password == '' || newPass == '' || konfPass == ''
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