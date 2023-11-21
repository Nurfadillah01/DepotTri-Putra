import { View, Text, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert, StatusBar } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginHandle = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('berhasil')
            })
            .catch(error => {
                Alert.alert('Email dan Password', 'Silahkan periksa kembali email dan password anda', [
                    { text: 'OK' },
                ]);
            });
    }
    return (
        <ScrollView style={{ height, width, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#EEFCFF'} barStyle={'dark-content'} />
            <View style={{ height: height * 3 / 5, width, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/images/logo.png')}
                    style={{ height: 350, width: 350 }}
                />
            </View>
            <View style={{ height: height * 2 / 5, width, paddingHorizontal: 20, justifyContent: 'space-evenly' }}>
                <View>
                    <Text style={{ color: '#000000' }}>Silahkan login disini</Text>
                    <TextInput
                        placeholder='Email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 20 }}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        placeholder='Password'
                        secureTextEntry
                        style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', elevation: 3 }}
                        onChangeText={setPassword}
                    />
                </View>
                {email == '' || password == ''
                    ? <View
                        style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3, opacity: 0.5 }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>LOGIN</Text>
                    </View>
                    : <TouchableOpacity
                        style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}
                        onPress={() => loginHandle()}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>LOGIN</Text>
                    </TouchableOpacity>
                }

                {/* <View style={{ height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000000' }}>Belum punya akun?</Text>
                    <TouchableOpacity style={{ height: 30, width: 120, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', marginStart: 5, elevation: 3, borderRadius: 5 }}>
                        <Text style={{ color: '#FFFFFF' }}>Daftar Sekarang</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    )
}