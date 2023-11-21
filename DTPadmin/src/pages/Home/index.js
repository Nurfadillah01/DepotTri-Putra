import { View, Text, Dimensions, TouchableOpacity, FlatList, Image, Modal, TextInput, StatusBar, Linking, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import database from '@react-native-firebase/database'
import Geolocation from '@react-native-community/geolocation';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Home({ navigation }) {
    const [loading, setloading] = useState(true)
    const [nama, setnama] = useState(undefined)
    const [data, setData] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const [harga, setHarga] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [stock, setStock] = useState('')
    const [gambar, setGambar] = useState(null)
    const [latlng, setLatlng] = useState([])

    useEffect(() => {
        const unsubscribe = database().ref('Admin/Produk/').on('value', snap => {
            if (snap.val() == null) {
                setloading(false)
                setData(null)
            } else {
                let dataArr = []
                snap.forEach(item => {
                    dataArr.push({
                        key: item.key,
                        harga: item.val().harga,
                        deskripsi: item.val().deskripsi,
                        gambar: item.val().gambar,
                        stock: item.val().stock
                    })
                })
                setloading(false)
                setData(dataArr)
            }
        })

        return () => {
            unsubscribe
        }
    }, [])

    useEffect(() => {
        const unsubscribe = database().ref('Admin/Profile/').on('value', snap => {
            if (snap.val() == null) {
                setnama(undefined)
            } else {
                setnama(snap.val().nama)
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

    const mapHandle = () => {
        Linking.openURL(`geo:${latlng.latitude},${latlng.longitude}`)
    }

    const visibleHandle = (item) => {
        setDeskripsi(item.deskripsi)
        setGambar(item.gambar)
        setHarga(item.harga)
        setStock(item.stock.toString())
        setIsVisible(true)
    }

    const invisibleHandle = () => {
        setIsVisible(false)
        setDeskripsi('')
        setGambar(null)
        setHarga('')
        setStock('')
    }

    const renderModal = () => {
        let bilangan = harga;
        let reverse = bilangan.toString().split('').reverse().join(''),
            nilai = reverse.match(/\d{1,3}/g);
        if (nilai == null) {
            null
        } else {
            nilai = nilai.join('.').split('').reverse().join('');
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
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5 }}>LIHAT PRODUK</Text>
                    <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }} />
                </View>
                <View style={{ height, width, padding: 20 }}>
                    <View style={{ height: (height - 60) * 2 / 5, justifyContent: 'space-evenly', alignItems: 'center' }}>
                        {gambar == null
                            ? <View style={{ height: 144, width: 240, backgroundColor: '#ffffff', borderRadius: 10, elevation: 3, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Belum ada gambar</Text>
                            </View>
                            : <Image
                                style={{ height: 144, width: 240, backgroundColor: '#ffffff', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                                source={{ uri: `data:image/jpeg;base64,${gambar}` }}
                            />
                        }
                    </View>
                    <View style={{ height: (height - 60) * 2 / 5 }}>
                        <Text>Harga</Text>
                        <TextInput
                            editable={false}
                            style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', marginBottom: 20, color: '#000000' }}
                            value={nilai}
                        />
                        <Text>Deskripsi</Text>
                        <TextInput
                            editable={false}
                            style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', marginBottom: 20, color: '#000000' }}
                            value={deskripsi}
                        />
                        <Text>Stock</Text>
                        <TextInput
                            editable={false}
                            style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', marginBottom: 20, color: '#000000' }}
                            value={stock}
                        />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ width, height, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#0077b6'} />
            <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0077b6' }}>
                <View style={{ height: 60, width: 60 }} />
                {nama == undefined
                    ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5, textTransform: 'uppercase' }}>Beranda</Text>
                    : <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5, textTransform: 'uppercase' }}>{nama}</Text>
                }
                <TouchableOpacity
                    onPress={() => mapHandle()}
                    style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name='map-marked-alt' size={20} color='#ffffff' />
                </TouchableOpacity>
            </View>
            {loading == true
                ? <View style={{ height: height - 120, width, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} />
                </View>
                : <View>
                    {data == null
                        ? <View style={{ height: height - 120, width, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Silahkan melakukan penambahan produk</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>pada menu </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Pengaturan')}
                                >
                                    <Text style={{ color: '#0077b6', fontWeight: 'bold' }}>Pengaturan</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : <View style={{ height: height - 60, width, padding: 10 }}>
                            <FlatList
                                style={{ height }}
                                data={data}
                                renderItem={({ item, index }) => {
                                    let bilangan = item.harga;
                                    let reverse = bilangan.toString().split('').reverse().join(''),
                                        nilai = reverse.match(/\d{1,3}/g);
                                    if (nilai == null) {
                                        null
                                    } else {
                                        nilai = nilai.join('.').split('').reverse().join('');
                                    }
                                    return (
                                        <TouchableOpacity
                                            onPress={() => visibleHandle(item)}
                                            key={item.key}
                                            style={{ height: 90, backgroundColor: '#ffffff', elevation: 3, borderRadius: 10, margin: 5, flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image
                                                    style={{ height: 80, width: 140, backgroundColor: '#ffffff', borderRadius: 10 }}
                                                    source={{ uri: `data:image/jpeg;base64,${item.gambar}` }}
                                                />
                                                <View style={{ marginLeft: 5, justifyContent: 'space-between' }}>
                                                    <Text>{item.deskripsi}</Text>
                                                    <Text>Rp {nilai},-</Text>
                                                    <Text>Stock {item.stock}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    }
                </View>
            }
            <Modal
                visible={isVisible}
                onRequestClose={() => invisibleHandle()}
            >
                {isVisible == false
                    ? null
                    : renderModal()
                }
            </Modal>
        </View>
    )
}