import { View, Text, Dimensions, TouchableOpacity, Alert, StatusBar } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import auth from '@react-native-firebase/auth'

const height = Dimensions.get('window').height - 49;
const width = Dimensions.get('window').width;

export default function Pengaturan({ navigation }) {
    const signOutHandle = () => {
        Alert.alert('', 'Keluar dari akun?', [
            { text: 'Ya', onPress: () => auth().signOut() },
            { text: 'Batal' },
        ]);
    }
    return (
        <View style={{ width, height, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#0077b6'} />
            <View style={{ height: 60, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5 }}>PENGATURAN</Text>
            </View>
            <View style={{ justifyContent: 'space-between', height: height - 60, padding: 20 }}>
                <View style={{ height: 110, justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Produk')}
                        style={{
                            height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            elevation: 5, backgroundColor: '#ffffff', paddingHorizontal: 10, borderRadius: 5
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Produk</Text>
                        <Icon name='chevron-right' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Akun')}
                        style={{
                            height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            elevation: 5, backgroundColor: '#ffffff', paddingHorizontal: 10, borderRadius: 5
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Akun</Text>
                        <Icon name='chevron-right' size={20} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={signOutHandle}
                    style={{
                        height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        elevation: 5, backgroundColor: '#ffffff', paddingHorizontal: 10, borderRadius: 5
                    }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Keluar</Text>
                    <Icon name='sign-out-alt' size={20} color='#FE4964' />
                </TouchableOpacity>
            </View>
        </View>
    )
}