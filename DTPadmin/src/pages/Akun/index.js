import { View, Text, Dimensions, TouchableOpacity, Alert, StatusBar } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import auth from '@react-native-firebase/auth'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Akun({ navigation }) {
    const resetHandle = () => {
        Alert.alert('', 'Reset kata sandi?', [
            {
                text: 'Ya', onPress: () => {
                    auth().sendPasswordResetEmail('depotputra20@gmail.com')
                        .then(() => {
                            Alert.alert('', 'Silahkan periksa email anda', [
                                {
                                    text: 'Ok', onPress: () => {
                                        auth().signOut()
                                    }
                                },
                            ]);
                        })
                }
            },
            { text: 'Batal' },
        ]);
    }
    return (
        <View style={{ width, height, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#0077b6'} />
            <View style={{ height: 60, backgroundColor: '#0077b6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon name='chevron-left' size={16} color='#ffffff' />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5 }}>AKUN</Text>
                <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }} />
            </View>
            <View style={{ justifyContent: 'space-between', height: height - 60, padding: 20 }}>
                <View style={{ height: 170, justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                        style={{
                            height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            elevation: 5, backgroundColor: '#ffffff', paddingHorizontal: 10, borderRadius: 5
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Profil</Text>
                        <Icon name='chevron-right' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => resetHandle()}
                        style={{
                            height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            elevation: 5, backgroundColor: '#ffffff', paddingHorizontal: 10, borderRadius: 5
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Reset Kata Sandi</Text>
                        <Icon name='chevron-right' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('User')}
                        style={{
                            height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            elevation: 5, backgroundColor: '#ffffff', paddingHorizontal: 10, borderRadius: 5
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Pengguna</Text>
                        <Icon name='chevron-right' size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}