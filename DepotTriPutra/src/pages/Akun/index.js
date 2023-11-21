import { View, Text, Touchable, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth';

export default function Akun() {
  const [nama, setnama] = useState('')
  const [email, setemail] = useState('')
  const [alamat, setalamat] = useState('')
  const [nomor, setnomor] = useState('')
  const { uid } = auth().currentUser

  useEffect(() => {
    const unsubscribe = database().ref(`User/Account/${uid}/Profile/`).on('value', snap => {
      setnama(snap.val().nama)
      setemail(snap.val().email)
      setalamat(snap.val().alamat)
      setnomor(snap.val().nomor_telpon)
    })

    return () => {
      unsubscribe
    }
  }, [])


  const logout = () => {
    Alert.alert('', 'Keluar', [
      {
        text: 'Ya', onPress: () => auth().signOut()
      },
      {
        text: 'Batal'
      }
    ]);

  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 40 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Akun Saya</Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text>Nama Lengkap</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='person' size={22} />
          <View style={{ flex: 1, marginLeft: 10, marginTop: 10, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, height: 50, justifyContent: 'center', paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 18, textTransform: 'capitalize' }}>{nama}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Email</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='mail' size={22} />
          <View style={{ flex: 1, marginLeft: 10, marginTop: 10, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, height: 50, justifyContent: 'center', paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 18 }}>{email}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Alamat</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='contact-mail' size={20} />
          <View style={{ flex: 1, marginLeft: 10, marginTop: 10, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, height: 50, justifyContent: 'center', paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 18 }}>{alamat}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Nomor Telepon</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='call' size={22} />
          <View style={{ flex: 1, marginLeft: 10, marginTop: 10, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, height: 50, justifyContent: 'center', paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 18 }}>{nomor}</Text>
          </View>
        </View>
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => logout()} style={{ height: 35, width: 100, backgroundColor: '#FE4964', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}