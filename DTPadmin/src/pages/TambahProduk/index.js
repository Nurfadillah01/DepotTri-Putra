import { View, Text, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert, Image, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import database from '@react-native-firebase/database'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function TambahProduk({ navigation }) {
    const [harga, setHarga] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [stock, setStock] = useState('')
    const [gambar, setGambar] = useState(null)
    const [dataLenght, setdataLenght] = useState(0)

    useEffect(() => {
        const unsubsribe = database().ref('Admin/Produk/').on('value', snap => {
            if (snap.val() == null) {
                setdataLenght(0)
            } else {
                setdataLenght(snap._snapshot.childKeys.length)
            }
        })

        return () => {
            unsubsribe
        }
    }, [])

    const ambilHandle = () => {
        Alert.alert('', 'Pilih penyimpanan', [
            { text: 'Batal' },
            { text: 'Galeri', onPress: () => openGalery() },
            { text: 'Kamera', onPress: () => openCamera() },
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

    const simpanHandle = () => {
        Alert.alert('', 'Simpan data?', [
            {
                text: 'Ya', onPress: () => {
                    database().ref(`Admin/Produk/`).push({ harga, deskripsi, stock, gambar })
                        .then(setHarga(''), setDeskripsi(''), setStock(''), setGambar(null),
                            Alert.alert('', 'Data tersimpan', [
                                { text: 'Tutup' },
                                { text: 'Halaman sebelumnya', onPress: () => navigation.goBack() },
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
            { text: 'Batal' },
        ]);
    }

    return (
        <ScrollView style={{ width, height, backgroundColor: '#EEFCFF' }}>
            <StatusBar backgroundColor={'#0077b6'} />
            <View style={{ height: 60, backgroundColor: '#0077b6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon name='chevron-left' size={16} color='#ffffff' />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 5 }}>TAMBAH PRODUK</Text>
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
                        <Text style={{ color: '#0077b6', fontWeight: 'bold' }}>Ambil Gambar</Text>
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
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>SIMPAN</Text>
                        </View>
                        : <TouchableOpacity
                            onPress={() => simpanHandle()}
                            style={{ height: 40, backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 3 }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>SIMPAN</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </ScrollView>
    )
}