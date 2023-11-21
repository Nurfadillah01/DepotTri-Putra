import { View, Text, TouchableOpacity, Alert, FlatList, Modal, Dimensions, Image, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import database from '@react-native-firebase/database';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import auth from '@react-native-firebase/auth'

export default function Keranjang({ navigation }) {
    const [data, setData] = useState(null)

    const [alamat, setAlamat] = useState('Set lokasi anda >>')
    const [latlng, setLatlng] = useState([])
    const [nama, setNama] = useState('')
    const [nomor, setNomor] = useState('')
    const [status, setstatus] = useState(false)
    const [m_map, setM_Map] = useState(false)
    const [block, setblock] = useState(false)

    const { uid } = auth().currentUser

    const date = new Date()
    const tanggal = date.getDate()
    const bulan = date.getMonth()
    const tahun = date.getFullYear()
    const jam = date.getHours()
    const menit = date.getMinutes()

    useEffect(() => {
        const unsubscribe = database().ref(`Pesanan/Dikirim/${uid}/`).on('value', snap => {
            if (snap.val() == null) {
                setblock(false)
            } else {
                setblock(true)
            }
        })

        return () => {
            unsubscribe
        }
    }, [])

    useEffect(() => {
        database().ref(`User/Account/${uid}/Profile/`).on('value', snap => {
            if (snap == undefined) {
                null
            } else {
                setNama(snap.val().nama)
                setNomor(snap.val().nomor_telpon)
                setstatus(snap.val().status)
            }
        })
    }, [])

    useEffect(() => {
        const unsubscribe = database().ref(`/User/Account/${uid}/k_pesanan`).on('value', (snapshoot) => {
            if (snapshoot.val() == null) {
                setData(null)
            } else {
                let task = []
                snapshoot.forEach(child => {
                    task.push({
                        key: child.key,
                        nama_barang: child._snapshot.value.nama_barang,
                        quantity: child._snapshot.value.quantity,
                        harga_satuan: child._snapshot.value.harga,
                        total_harga: child._snapshot.value.total_harga
                    })
                })
                setData(task)
            }
        })

        return () => {
            unsubscribe
        }
    }, [])

    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            let latlng = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude
            }
            setLatlng(latlng)
        })
    }, [])

    const getAddressLocation = async (e) => {
        setLatlng({
            latitude: e.latitude,
            longitude: e.longitude
        })
        const latitude = e.latitude
        const longitude = e.longitude
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD02xHt4Bzd-l6FIHLNLpf7cleO_HBUgds`,
            );
            const json = await response.json();
            const alamat = json.results[0].formatted_address
            setAlamat(alamat);
        } catch (error) {
            console.error(error);
        }
    };

    const checkOut = () => {
        if (status == false) {
            Alert.alert('Akun anda ditangguhkan', 'Untuk sementara anda tidak dapat membuat pesanan', [
                {
                    text: 'Ok'
                },
            ]);
        } else if (block == true) {
            Alert.alert('', 'Mohon tunggu sampai pesanan sebelumnya selesai', [
                {
                    text: 'Ok'
                },
            ]);
        } else if (alamat == 'Set lokasi anda >>') {
            Alert.alert('', 'Silahkan tentukan lokasi anda', [
                {
                    text: 'Ok'
                },
            ]);
        } else if (data == null) {
            Alert.alert('', 'Silahkan masukkan pesanan ke troli', [
                {
                    text: 'Ok'
                },
            ]);
        } else {
            Alert.alert('', 'Proses pesanan?', [
                {
                    text: 'Batal'
                },
                {
                    text: 'Ya', onPress: () => {
                        database().ref(`Pesanan/Masuk/${uid}/`).set({
                            Alamat: {
                                latitude: latlng.latitude, longitude: latlng.longitude, alamat
                            },
                            Info_User: {
                                nama, nomor, tanggal: `${tanggal}/${bulan}/${tahun}`, jam: `${jam}:${menit}`
                            },
                        })
                        data.forEach(child => {
                            database().ref(`Pesanan/Masuk/${uid}/Pesanan/${child.key}/`).update({
                                harga: child.harga_satuan, nama_barang: child.nama_barang, total_harga: child.total_harga, quantity: child.quantity
                            })
                        })
                        database().ref(`/User/Account/${uid}/k_pesanan/`).remove().then(() => navigation.navigate('Menunggu'))
                    }
                },
            ]);
        }
    }

    const deleteHandle = (item) => {
        Alert.alert('', 'Hapus dari troli?', [
            {
                text: 'Batal'
            },
            {
                text: 'Ya', onPress: () => {
                    database().ref(`/User/Account/${uid}/k_pesanan/${item.key}`).remove()
                }
            },
        ]);
    }

    const { height } = Dimensions.get('window')
    const { width } = Dimensions.get('window')
    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <StatusBar backgroundColor={'#f0f0f0'} barStyle={'dark-content'} />
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Alamat Pengantaran</Text>
            </View>
            <View style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
                <View style={{ borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
                    {/* <TextInput value={alamat} onChangeText={(e) => setAlamat(e)} placeholder='Alamat' style={{ paddingHorizontal: 10 }} /> */}
                    <Text style={{}}>{alamat}</Text>
                </View>
                <TouchableOpacity onPress={() => setM_Map(true)} style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name='map' size={20} color='#D84646' />
                </TouchableOpacity>
            </View>
            <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => checkOut()}
                    style={{ height: 40, width: 100, backgroundColor: '#02D4BA', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>Checkout</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: 'bold', display: data == null ? 'none' : 'flex' }}>List pesanan</Text>
                </View>
                <View style={{ paddingHorizontal: 10, marginTop: 10, flex: 1 }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (
                            <View style={{
                                marginTop: 5, shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,

                                elevation: 2,
                                backgroundColor: '#f0f0f0',
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 15,
                                marginBottom: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100, fontWeight: 'bold' }}>Nama barang</Text>
                                        <Text>:</Text>
                                        <Text style={{}}> {item.nama_barang}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100, fontWeight: 'bold' }}>Quantity</Text>
                                        <Text>:</Text>
                                        <Text style={{}}> {item.quantity}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100, fontWeight: 'bold' }}>Harga satuan</Text>
                                        <Text>:</Text>
                                        <Text style={{}}> Rp.</Text>
                                        <Text style={{}}>{item.harga_satuan}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ width: 100, fontWeight: 'bold' }}>Total harga</Text>
                                        <Text>:</Text>
                                        <Text style={{}}> Rp.</Text>
                                        <Text style={{ fontWeight: 'bold' }}> {item.total_harga}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => deleteHandle(item)}
                                    style={{ marginRight: 20 }}>
                                    <Icon name='delete' size={20} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
            <Modal
                onRequestClose={() => setM_Map(false)}
                visible={m_map}>
                <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ height: '100%', width: '100%' }}
                        initialRegion={{
                            latitude: latlng.latitude,
                            longitude: latlng.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onRegionChangeComplete={(e) => getAddressLocation(e)}
                    >
                    </MapView>
                    <View style={{ position: 'absolute', top: height / 2.24, right: width / 2.21, alignItems: 'center' }}>
                        <Image source={require('../../assets/pin.png')} style={{ height: 35, width: 35 }} />
                        <View style={{
                            height: 2, width: 3,
                            borderRadius: 10,
                            backgroundColor: 'gray',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 2
                        }}></View>
                    </View>
                    <TouchableOpacity onPress={() => setM_Map(false)} style={{
                        height: 40,
                        position: 'absolute',
                        width: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                        marginTop: 10,
                        backgroundColor: 'white',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,

                        elevation: 3
                    }}>
                        <Icon name='close' size={20} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', height: 60, width: width, position: 'absolute', top: 80, paddingHorizontal: 15, alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', height: 40, flex: 1, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: 'gray' }}>
                            <Text numberOfLines={2}>{alamat}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setM_Map(false)} style={{ height: 40, justifyContent: 'center', paddingHorizontal: 15, marginLeft: 10, backgroundColor: '#02D4BA', borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>Pilih alamat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
