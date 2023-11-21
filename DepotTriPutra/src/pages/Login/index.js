import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, Modal, StatusBar, Alert } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [notife, setNotife] = useState('')
    const Height = Dimensions.get('window').height

    const loginPress = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                Alert.alert('', 'Email atau password salah', [
                    {
                        text: 'Ok'
                    },
                ]);
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <StatusBar backgroundColor={'#f0f0f0'} barStyle={'dark-content'} />
            <View style={{ height: Height / 4, justifyContent: 'center', alignItems: 'center' }}>
                {/* <View style={{ height: 150, width: 150, elevation: 5, backgroundColor: '#ffffff', borderRadius: 10 }}> */}
                    <Image source={require('../../assets/Logo_w.png')} style={{ resizeMode: 'center', height: 150, width: 150, borderRadius: 10 }} />
                {/* </View> */}
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Silahkan login disini</Text>
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>{notife}</Text>
                    <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                        <TextInput onChangeText={(e) => setEmail(e)} placeholder='Email' keyboardType='email-address' style={{ paddingHorizontal: 10 }} />
                    </View>
                    <View style={{ marginTop: 20, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5 }}>
                        <TextInput onChangeText={(e) => setPassword(e)} placeholder='Password' secureTextEntry={true} style={{ paddingHorizontal: 10 }} />
                    </View>
                    {email == '' || password == ''
                        ? <View style={{ height: 50, backgroundColor: '#02D4BA', marginTop: 20, borderRadius: 5, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff' }}>Login</Text>
                        </View>
                        : <TouchableOpacity onPressIn={() => loginPress()} style={{ height: 50, backgroundColor: '#02D4BA', marginTop: 20, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff' }}>Login</Text>
                        </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <Text>Belum punya akun?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginLeft: 10 }}>
                            <Text style={{ color: '#0291D4' }}>Daftar sekarang</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}