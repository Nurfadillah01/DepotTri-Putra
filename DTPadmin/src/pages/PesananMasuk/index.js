import { View, Text, Dimensions, FlatList, TouchableOpacity, Modal, Linking, Alert, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import database from '@react-native-firebase/database'
import Icon from 'react-native-vector-icons/FontAwesome5';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function PesananMasuk() {
    const [data, setData] = useState(null)
    const [dataModal, setDataModal] = useState(null)
    const [isVisible, setisVisible] = useState(false)
    const [key, setkey] = useState(null)
    const [longitude, setlongitude] = useState(null)
    const [latitude, setlatitude] = useState(null)
    const [alamat, setalamat] = useState(null)
    const [nama, setnama] = useState(null)
    const [nomor, setnomor] = useState(null)
    const [jam, setjam] = useState(null)
    const [tanggal, settanggal] = useState(null)

    useEffect(() => {
        const unsubscribe = database().ref('Pesanan/Masuk/').on('value', snap => {
            if (snap.val() == null) {
                setData(null)
            } else {
                let dataArr = []
                snap.forEach(item => {
                    dataArr.push({
                        key: item.key,
                        latitude: item.val().Alamat.latitude,
                        longitude: item.val().Alamat.longitude,
                        alamat: item.val().Alamat.alamat,
                        nama: item.val().Info_User.nama,
                        nomor: item.val().Info_User.nomor,
                        jam: item.val().Info_User.jam,
                        tanggal: item.val().Info_User.tanggal,
                    })
                })
                setData(dataArr)
            }
        })
        return () => {
            unsubscribe
        }
    }, [])


    const visibleHandle = (item) => {
        database().ref(`Pesanan/Masuk/${item.key}/Pesanan/`).once('value', snap => {
            if (snap == null) {
                null
            } else {
                let dataArr = []
                snap.forEach(item1 => {
                    dataArr.push({
                        key: item1.key,
                        harga: item1.val().harga,
                        produk: item1.val().nama_barang,
                        quantity: item1.val().quantity,
                        total_harga: item1.val().total_harga
                    })
                })
                setDataModal(dataArr)
            }
        })
        setkey(item.key)
        setlatitude(item.latitude)
        setlongitude(item.longitude)
        setalamat(item.alamat)
        setnama(item.nama)
        setnomor(item.nomor)
        setjam(item.jam)
        settanggal(item.tanggal)
        setisVisible(true)
    }



    const invisibleHandle = () => {
        setkey(null)
        setlatitude(null)
        setlongitude(null)
        setalamat(null)
        setnama(null)
        setnomor(null)
        setjam(null)
        settanggal(null)
        setisVisible(false)
    }

    const mapsHandle = () => {
        const location = `${latitude},${longitude}`
        Linking.openURL(`geo:${location}?center=${location}&q=${location}&z=16`)
    }

    const phoneHandle = () => {
        Linking.openURL(`tel:${nomor}`)
    }

    const konfirmHandle = () => {
        Alert.alert('', 'Konfirmasi pesanan?', [
            {
                text: 'Batal'
            },
            {
                text: 'Ya', onPress: () => {
                    database().ref(`Pesanan/Dikirim/${key}/`).update({
                        Alamat: {
                            latitude, longitude, alamat
                        },
                        Info_User: {
                            nama, nomor, jam, tanggal
                        },
                    }).then(() => {
                        dataModal.forEach(child => {
                            database().ref(`Pesanan/Dikirim/${key}/Pesanan/${child.key}/`).update({
                                harga: child.harga, nama_barang: child.produk, total_harga: child.total_harga, quantity: child.quantity
                            }).then(() => {
                                database().ref(`Pesanan/Masuk/${key}/`).remove()
                                    .then(() => {
                                        invisibleHandle()
                                    })
                            })
                        })
                    })
                }
            },
        ])
    }

    const renderModal = () => {
        let total1 = 0
        dataModal.forEach(child => {
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
            <View style={{ width, height, backgroundColor: '#EEFCFF' }}>
                <View style={{ height: 60, backgroundColor: '#0077b6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => invisibleHandle()}
                        style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Icon name='chevron-left' size={16} color='#ffffff' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>Detail Pesanan</Text>
                    <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }} />
                </View>
                <View style={{ height: height - 60, width, justifyContent: 'space-between', padding: 20 }}>
                    <View style={{}}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text>{jam} - {tanggal}</Text>
                        </View>
                        <View style={{ height: 60, marginBottom: 5 }}>
                            <Text>Nama Pemesan</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000', marginLeft: 20 }}>{nama}</Text>
                        </View>
                        <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <View>
                                <Text>Nomor Telepon</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000', marginLeft: 20 }}>{nomor}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => phoneHandle()}
                                style={{ height: 40, width: 40, backgroundColor: '#EEFCFF', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                                <Icon name='phone' size={20} color='#0077b6' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 60, width: width - 40, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <View style={{ width: width - 120 }}>
                                <Text>Alamat</Text>
                                <Text
                                    numberOfLines={1}
                                    style={{ fontWeight: 'bold', fontSize: 16, color: '#000000', marginLeft: 20 }}>{alamat}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => mapsHandle()}
                                style={{ height: 40, width: 40, backgroundColor: '#EEFCFF', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                                <Icon name='map-marked-alt' size={20} color='#0077b6' />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            style={{}}
                            data={dataModal}
                            renderItem={({ item, index }) => {
                                let bilangan = item.total_harga;
                                let reverse = bilangan.toString().split('').reverse().join(''),
                                    nilai = reverse.match(/\d{1,3}/g);
                                if (nilai == null) {
                                    null
                                } else {
                                    nilai = nilai.join('.').split('').reverse().join('');
                                }
                                return (
                                    <View style={{ height: 60, marginBottom: 5 }}>
                                        <Text>Produk {index + 1}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: (width - 60) * 3 / 5 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000', marginLeft: 20 }}>{item.produk}</Text>
                                            </View>
                                            <View style={{ width: (width - 60) * 0.5 / 5 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>x{item.quantity}</Text>
                                            </View>
                                            <View style={{ width: (width - 60) * 1.5 / 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>Rp</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>{nilai},-</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={{ height: 100 }}>
                        <View style={{ height: 40, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>Total Pembayaran:</Text>
                            <View style={{ width: (width - 60) * 1.5 / 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>Rp</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>{nilai1},-</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => konfirmHandle()}
                            style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Konfirmasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ width, height, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#0077b6'} />
            {data == null
                ? <View style={{ height: height - 120, width, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Belum ada pesanan masuk</Text>
                </View>
                : <View style={{ height: height - 60, width, padding: 10 }}>
                    <FlatList
                        style={{ height }}
                        data={data}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => visibleHandle(item)}
                                    key={item.key}
                                    style={{ height: 90, backgroundColor: '#ffffff', elevation: 3, borderRadius: 10, margin: 5, flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                                    <View style={{ width: width - 50, justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 18, color: '#000000' }}>{item.nama}</Text>
                                            <Text >{item.tanggal}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{item.nomor}</Text>
                                            <Text >{item.jam}</Text>
                                        </View>
                                        <Text numberOfLines={1}>{item.alamat}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            }
            <Modal
                visible={isVisible}
                onRequestClose={() => invisibleHandle()}
            >
                {dataModal == null
                    ? null
                    : renderModal()
                }
            </Modal>
        </View>
    )
}