import { View, Text, TouchableOpacity, FlatList, Dimensions, Linking, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'

const { width } = Dimensions.get('window')

export default function Diterima() {
    const [data, setData] = useState([])
    const [alamat, setalamat] = useState('')
    const [latitude, setlatitude] = useState('')
    const [longitude, setlongitude] = useState('')
    const [tanggal, settanggal] = useState('')
    const [jam, setjam] = useState('')
    const { uid } = auth().currentUser

    useEffect(() => {
        const unsubscribe = database().ref(`Pesanan/Dikirim/${uid}/`).on('value', snap => {
            if (snap.val() == null) {
                removeData()
            } else {
                setalamat(snap.val().Alamat.alamat)
                setlatitude(snap.val().Alamat.latitude)
                setlongitude(snap.val().Alamat.longitude)
                settanggal(snap.val().Info_User.tanggal)
                setjam(snap.val().Info_User.jam)
            }
        })
        return () => {
            unsubscribe
        }
    }, [])

    useEffect(() => {
        const unsubscribe = database().ref(`Pesanan/Dikirim/${uid}/Pesanan/`).on('value', snap => {
            if (snap.val() == null) {
                removeData()
            } else {
                let dataArr = []
                snap.forEach(item1 => {
                    dataArr.push({
                        key: item1.key,
                        nama_barang: item1.val().nama_barang,
                        harga: item1.val().harga,
                        quantity: item1.val().quantity,
                        total_harga: item1.val().total_harga
                    })
                })
                setData(dataArr)
            }
        })
        return () => {
            unsubscribe
        }
    }, [])

    const removeData = () => {
        setData([])
        setalamat('')
        setlatitude('')
        setlongitude('')
        settanggal('')
        setjam('')
    }

    const mapsHandle = () => {
        const location = `${latitude},${longitude}`
        Linking.openURL(`geo:${location}?center=${location}&q=${location}&z=16`)
    }

    let total1 = 0
    data.forEach(child => {
        total1 = total1 + child.total_harga
    })
    let bilangan1 = total1;
    let reverse1 = bilangan1.toString().split('').reverse().join(''),
        nilai1 = reverse1.match(/\d{1,3}/g);
    if (nilai1 == null) {
        null
    } else {
        nilai1 = nilai1.join('.').split('').reverse().join('');
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 20 }}>
            {data == ''
                ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Kosong</Text>
                </View>
                : <View style={{ flex: 1 }}>
                    <View style={{ height: 40, width: width - 40, alignItems: 'flex-end' }}>
                        <Text>{tanggal} - {jam}</Text>
                    </View>
                    <View style={{ height: 40, width: width - 40, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ width: 50 }}>Alamat</Text>
                        <Text>: </Text>
                        <Text numberOfLines={1} style={{ flex: 1 }}>{alamat}</Text>
                        <TouchableOpacity
                            onPress={() => mapsHandle()}
                            style={{ height: 40, width: 40, backgroundColor: '#02D4BA', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                            <Icon name='map-marked-alt' size={20} color='#ffffff' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Pesanan</Text>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => {
                            return (
                                <View style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 10,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1.41,

                                    elevation: 3, marginBottom: 5
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100 }}>Nama Barang</Text>
                                        <Text>:</Text>
                                        <Text> {item.nama_barang}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100 }}>Quantity</Text>
                                        <Text>:</Text>
                                        <Text> {item.quantity} Pcs</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100 }}>Harga</Text>
                                        <Text>:</Text>
                                        <Text> Rp.{item.harga}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100 }}>Total Harga</Text>
                                        <Text>:</Text>
                                        <Text> Rp.{item.total_harga}</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    <View style={{ height: 80, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>Total Pembayaran: </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>Rp {nilai1},-</Text>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}