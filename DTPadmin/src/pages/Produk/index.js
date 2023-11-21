import { View, Text, Dimensions, TouchableOpacity, FlatList, Image, Alert, Modal, ScrollView, TextInput, ActivityIndicator, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import database from '@react-native-firebase/database'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Produk({ navigation }) {
    const [loading, setloading] = useState(true)
    const [data, setData] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const [harga, setHarga] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [stock, setStock] = useState('')
    const [gambar, setGambar] = useState(null)
    const [keyData, setKeyData] = useState(null)

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

    const hapusHandle = (item) => {
        Alert.alert('', `Hapus ${item.deskripsi}?`, [
            { text: 'Batal' },
            { text: 'Hapus', onPress: () => database().ref(`Admin/Produk/${item.key}`).remove() },
        ])

    }

    const visibleHandle = (item) => {
        setDeskripsi(item.deskripsi)
        setGambar(item.gambar)
        setHarga(item.harga)
        setStock(item.stock.toString())
        setKeyData(item.key)
        setIsVisible(true)
    }

    const invisibleHandle = () => {
        setIsVisible(false)
        setDeskripsi('')
        setGambar(null)
        setHarga('')
        setStock('')
        setKeyData(null)
    }

    const ambilHandle = () => {
        Alert.alert('', 'Pilih penyimpanan', [
            { text: 'Batal' },
            { text: 'Galeri', onPress: () => openGalery() },
            { text: 'Kamera', onPress: () => openCamera() },
        ]);
    }

    const updateHandle = () => {
        Alert.alert('', 'Simpan perubahan?', [
            { text: 'Batal' },
            {
                text: 'Ya', onPress: () => {
                    database().ref(`Admin/Produk/${keyData}`).update({ harga, deskripsi, stock, gambar })
                        .then(setHarga(''), setDeskripsi(''), setStock(''), setGambar(null), setKeyData(null),
                            Alert.alert('', 'Data tersimpan', [
                                { text: 'Tutup', onPress: () => setIsVisible(false) },
                            ])
                        )
                        .catch(err => {
                            console.log(err)
                            Alert.alert('', 'Gagal', [
                                { text: 'Ok' },
                            ])
                        })
                }
            },
        ]);
    }

    const options = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 2000,
        maxWidth: 2000,
    };

    const openGalery = () => {

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageBase64 = response.base64 || response.assets?.[0]?.base64;
                setGambar(imageBase64);
            }
        });
    };

    const openCamera = () => {

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageBase64 = response.base64 || response.assets?.[0]?.base64;
                setGambar(imageBase64);
            }
        });
    };

    const renderModal = () => {
        return (
            <ScrollView style={{ width, height, backgroundColor: '#EEFCFF' }}>
                <View style={{ height: 60, backgroundColor: '#0077b6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => invisibleHandle()}
                        style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Icon name='chevron-left' size={16} color='#ffffff' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5 }}>UBAH PRODUK</Text>
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
                        <TouchableOpacity
                            onPress={() => ambilHandle()}
                            style={{ height: 40, width: 120, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                            <Text style={{ color: '#0077b6', fontWeight: 'bold' }}>Ubah Gambar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: (height - 60) * 2 / 5 }}>
                        <Text>Harga</Text>
                        <TextInput
                            placeholder='Masukkan harga'
                            keyboardType='numeric'
                            style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', marginBottom: 20 }}
                            value={harga}
                            onChangeText={setHarga}
                        />
                        <Text>Deskripsi</Text>
                        <TextInput
                            placeholder='Masukkan deskripsi'
                            keyboardType='default'
                            style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', marginBottom: 20 }}
                            value={deskripsi}
                            onChangeText={setDeskripsi}
                        />
                        <Text>Stock</Text>
                        <TextInput
                            placeholder='Masukkan stock'
                            keyboardType='numeric'
                            style={{ paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FFFFFF', marginBottom: 20 }}
                            value={stock}
                            onChangeText={setStock}
                        />
                    </View>
                    <View style={{ height: (height - 60) * 1 / 5, justifyContent: 'center' }}>
                        {harga == '' || deskripsi == '' || stock == '' || gambar == null
                            ? <View style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3, opacity: 0.5 }}>
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>UPDATE</Text>
                            </View>
                            : <TouchableOpacity
                                onPress={() => updateHandle()}
                                style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>UPDATE</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ScrollView>
        )
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5 }}>DATA PRODUK</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Tambah Produk')}
                    style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon name='plus-circle' size={16} color='#ffffff' />
                </TouchableOpacity>
            </View>
            {loading == true
                ? <View style={{ height: height - 120, width, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} />
                </View>
                : <View>
                    {data == null
                        ? <View style={{ height: height - 60, width, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Belum ada data</Text>
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
                                            <TouchableOpacity
                                                onPress={() => hapusHandle(item)}
                                                style={{ height: 80, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon name='trash' size={18} color='#FE4964' />
                                            </TouchableOpacity>
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