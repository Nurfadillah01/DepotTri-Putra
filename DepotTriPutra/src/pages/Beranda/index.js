import { View, Text, TouchableOpacity, TextInput, Image, Modal, Dimensions, FlatList, Alert, StatusBar, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'

export default function Beranda() {
    const [data, setData] = useState(null)
    const [m_detailProduk, setM_DetailProduk] = useState(false)
    const [nama_barang, setNama_Barang] = useState('')
    const [harga, setHarga] = useState('')
    const [quantity, setQuantity] = useState('')
    const [stok, setStok] = useState('')
    const [total_harga, setTotal_Harga] = useState('')
    const [gambar, setgambar] = useState('')
    const [keyProduk, setkeyProduk] = useState('')
    const { uid } = auth().currentUser

    useEffect(() => {
        const unsubscribe = database().ref('/Admin/Produk/').on('value', snap => {
            let task = [];
            snap.forEach(child => {
                task.push({
                    key: child.key,
                    harga: child._snapshot.value.harga,
                    nama_barang: child._snapshot.value.deskripsi,
                    stok: child._snapshot.value.stock,
                    gambar: child.val().gambar
                })
            })
            setData(task);
        })
        return () => {
            unsubscribe
        }
    }, [])


    const detailProduk = (item) => {
        setNama_Barang(item.nama_barang)
        setHarga(item.harga)
        setStok(item.stok)
        setgambar(item.gambar)
        setkeyProduk(item.key)
        visibleHanle()
    }

    const hitungHarga = (e) => {
        setQuantity(e)
        setTotal_Harga(e * harga)
    }

    const visibleHanle = () => {
        setM_DetailProduk(true)
    }

    const invisibleHandle = () => {
        setQuantity('')
        setTotal_Harga('')
        setM_DetailProduk(false)
    }

    const simpanKeranjang = () => {
        if (quantity == '') {
            Alert.alert('', 'Masukkan jumlah galon', [
                { text: 'Ok' },
            ])
        } else if (quantity > stok) {
            Alert.alert('Maaf', `Stok yang tersedia hanya ${stok} galon`, [
                { text: 'Ok' },
            ])
        } else {
            Alert.alert('', 'Tambah ke troli?', [
                { text: 'Batal' },
                {
                    text: 'Ya', onPress: () => {
                        database().ref(`/User/Account/${uid}/k_pesanan/${keyProduk}/`).update({
                            nama_barang, harga, quantity, total_harga
                        }).then(() => {
                            Alert.alert('', 'Berhasil disimpan', [
                                { text: 'OK', onPress: () => invisibleHandle() },
                            ])
                        })
                    }
                },
            ])
        }
    }

    const Height = Dimensions.get('window').height;

    let bilangan = total_harga;
    let reverse = bilangan.toString().split('').reverse().join(''),
        nilai = reverse.match(/\d{1,3}/g);
    if (nilai == null) {
        null
    } else {
        nilai = nilai.join('.').split('').reverse().join('');
    }
    let bilangan1 = harga;
    let reverse1 = bilangan1.toString().split('').reverse().join(''),
        nilai1 = reverse1.match(/\d{1,3}/g);
    if (nilai1 == null) {
        null
    } else {
        nilai1 = nilai1.join('.').split('').reverse().join('');
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <StatusBar backgroundColor={'#f0f0f0'} barStyle={'dark-content'} />
            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Depot Tri Putra</Text>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 20, height: 40, borderWidth: 1, borderColor: 'gray', justifyContent: "center", alignItems: 'center', marginTop: 5, borderRadius: 10 }}>
                <Text style={{ fontSize: 16 }}>Alamat :</Text>
                <Text style={{ fontSize: 16 }}>Depot Tri Putra Tataaran Patar</Text>
            </View>
            <View style={{ flex: 1, padding: 20 }}>
                {data == null
                    ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                    : <FlatList
                        data={data}
                        numColumns={2}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => detailProduk(item)} style={{
                                height: 150, width: 150, backgroundColor: "#f0f0f0", borderRadius: 10, elevation: 3, margin: 12
                            }}>
                                <View style={{ height: 90 }}>
                                    <Image source={{ uri: `data:image/jpeg;base64,${item.gambar}` }} style={{ height: 90, width: 150, resizeMode: 'stretch', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                </View>
                                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                    <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, marginTop: 5 }}>Rp {item.harga},-</Text>
                                    <Text style={{ color: '#585858', marginTop: 5 }}>{item.nama_barang}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                }
            </View>
            <Modal visible={m_detailProduk} animationType='slide' onRequestClose={() => invisibleHandle()}>
                <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                    <View style={{ height: 40, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => invisibleHandle()} style={{ height: 40, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='close' size={18} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: Height / 3, justifyContent: 'center', alignItems: 'center' }}>
                        {gambar == ''
                            ? null
                            : <Image source={{ uri: `data:image/jpeg;base64,${gambar}` }} style={{ height: Height / 3, width: '100%', resizeMode: 'contain' }} />
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#F3EEEE' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 65, fontWeight: 'bold' }}>Harga</Text>
                                <Text>:</Text>
                                <Text style={{}}> Rp.</Text>
                                <Text style={{ fontWeight: 'bold' }}>{nilai1}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 65, fontWeight: 'bold' }}>Stok</Text>
                                <Text>:</Text>
                                <Text style={{ color: stok !== 0 ? 'green' : 'red' }}> {stok !== 0 ? 'Ready' : 'Kosong'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ width: 65, fontWeight: 'bold' }}>Deskripsi</Text>
                                <Text>:</Text>
                                <Text> {nama_barang}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Masukan jumlah galon</Text>
                                </View>
                                <View style={{ marginTop: 10, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, marginHorizontal: 10 }}>
                                    <TextInput value={quantity} onChangeText={(e) => hitungHarga(e)} placeholder='0' keyboardType='number-pad' style={{ paddingHorizontal: 10 }} />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Total pembayaran</Text>
                                </View>
                                <View style={{ height: 49, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginTop: 10, borderWidth: 0.1, borderColor: 'grey', borderRadius: 5, marginHorizontal: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Rp.</Text>
                                    <Text>{nilai}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                            <View style={{}}>
                                <TouchableOpacity onPress={() => simpanKeranjang()} style={{ paddingHorizontal: 10, height: 40, backgroundColor: '#02D4BA', borderRadius: 5, alignItems: 'center', flexDirection: 'row' }}>
                                    <Icon name='shopping-cart-checkout' size={18} />
                                    <Text style={{ fontWeight: 'bold' }}>Tambah ke troli</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
