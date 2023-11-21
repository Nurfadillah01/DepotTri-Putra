import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function Register({ }) {
    const Height = Dimensions.get('window').height
    const [nama_lengkap, setNama_Lengkap] = useState('')
    const [alamat, setAlamat] = useState('')
    const [nomor_telpon, setNomor_Telpon] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const setRegist = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
                database().ref(`/User/Account/${user.user.uid}/Profile`).set({
                    nama: nama_lengkap,
                    email,
                    alamat,
                    nomor_telpon,
                    status: true
                })
            })
            .catch(error => {
                Alert.alert('', 'Mohon periksa kembali data anda', [
                    {
                        text: 'Ok'
                    },
                ]);
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <View style={{ height: Height / 4, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/Logo_w.png')} style={{ resizeMode: 'center', height: 150, width: 150, borderRadius: 10 }} />
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Depot Tri Putra</Text>
                        </View>
                        <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                            <TextInput onChangeText={setNama_Lengkap} placeholder='Nama lengkap' style={{ paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                            <TextInput onChangeText={setEmail} placeholder='Email' keyboardType='email-address' style={{ paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                            <TextInput onChangeText={setAlamat} placeholder='Alamat' style={{ paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                            <TextInput onChangeText={setNomor_Telpon} placeholder='Nomor telepon' keyboardType='number-pad' style={{ paddingHorizontal: 10 }} />
                        </View>
                        <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                            <TextInput onChangeText={setPassword} placeholder='Password' secureTextEntry={true} style={{ paddingHorizontal: 10 }} />
                        </View>
                        {email == '' || password == '' || alamat == '' || nomor_telpon == '' || nama_lengkap == ''
                            ? <View style={{ marginBottom: 20, height: 50, backgroundColor: '#02D4BA', marginTop: 20, borderRadius: 5, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff' }}>Daftar Sekarang</Text>
                            </View>
                            : <TouchableOpacity onPress={() => setRegist()} style={{ marginBottom: 20, height: 50, backgroundColor: '#02D4BA', marginTop: 20, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff' }}>Daftar Sekarang</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}