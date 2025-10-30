import React, { useState } from 'react';
import { Pressable, View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import { Snackbar } from 'react-native-paper';

export default function ScannerScreen()
{
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [bookData, setBookData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const showToast = (msg: string) =>
        {
            setSnackbarMessage(msg);
            setSnackbarVisible(true);
        };

    const fetchBookData = async (isbn: string) =>
        {
            try
            {
                setLoading(true);
                const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
                if (!res.ok) throw new Error(`Book not found (status ${res.status})`);
                const data = await res.json();
        
                const authorKey = data.authors?.[0]?.key;
                let authorName = 'Unknown';
        
                if (authorKey)
                {
                    const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
                    const authorData = await authorRes.json();
                    authorName = authorData.name;
                }
        
                setBookData({
                    title: data.title,
                    author: authorName,
                    year: data.publish_date,
                    isbn: isbn,
                    cover: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
                });
            }
            catch (err)
            {
                console.error(err);
                showToast('Error fetching book info.');
            }
            finally
            {
                setLoading(false);
            }
        };
        
        const handleAddToBookshelf = async () =>
        {
            if (!bookData) return;
        
            try
            {
                // check if book already exists
                const docRef = doc(firestore, 'Books', bookData.isbn);
                const existing = await getDoc(docRef);
        
                if (existing.exists())
                {
                    showToast('This book is already in your bookshelf.');
                    return;
                }
        
                await setDoc(docRef, bookData);
                showToast('Book added to bookshelf!');
            }
            catch (err)
            {
                console.error(err);
                showToast('Error adding book.');
            }
        };

    return (
        <View style={styles.container}>
            {showCamera ? (
                <CameraView
                    style={styles.camera}
                    barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8'] }}
                    onBarcodeScanned={({ data }) =>
                    {
                        setShowCamera(false);
                        setScannedCode(data);
                        fetchBookData(data);
                    }}
                />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Book Scanner</Text>

                    {loading && <ActivityIndicator size="large" />}

                    {bookData && (
                        <View style={styles.bookInfo}>
                            <Image source={{ uri: bookData.cover }} style={styles.cover} />
                            <Text style={styles.text}>{bookData.title}</Text>
                            <Text style={styles.text}>Author: {bookData.author}</Text>
                            <Text style={styles.text}>Year: {bookData.year}</Text>
                            <Pressable style={styles.button} onPress={handleAddToBookshelf}>
                                <Text style={styles.buttonText}>Add to Bookshelf</Text>
                            </Pressable>
                        </View>
                    )}

                    {!bookData && !loading && (
                        <Text>No book scanned yet.</Text>
                    )}

                    <Pressable style={styles.button} onPress={() => setShowCamera(true)}>
                        <Text style={styles.buttonText}>Open Camera</Text>
                    </Pressable>
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={2500}
                    >
                        {snackbarMessage}
                    </Snackbar>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    content: { padding: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    bookInfo: { alignItems: 'center', gap: 10, marginTop: 20 },
    text: { fontSize: 16 },
    cover: { width: 120, height: 180, borderRadius: 5 },
    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginTop: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
