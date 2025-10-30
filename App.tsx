import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';

import AppHeader from './components/AppHeader';
import BookInfo from './components/BookInfo';
import CameraScanner from './components/CameraScanner';

interface BookData
{
    title?: string;
    subtitle?: string;
    publish_date?: string;
    number_of_pages?: number;
    publishers?: string[];
    subjects?: string[];
    authors?: { key: string }[];
    isbn_13?: string[];
}

export default function App()
{
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [bookData, setBookData] = useState<BookData | null>(null);
    const [authorName, setAuthorName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>
    {
        if (!permission)
        {
            requestPermission();
        }
    }, [permission]);

    const fetchBookData = async (isbn: string) =>
    {
        try
        {
            setLoading(true);
            setError(null);
            setBookData(null);
            setAuthorName(null);

            const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
            if (!res.ok)
            {
                throw new Error('Book not found');
            }
            const data = await res.json();
            setBookData(data);

            if (data.authors && data.authors[0]?.key)
            {
                const authorRes = await fetch(`https://openlibrary.org${data.authors[0].key}.json`);
                const authorJson = await authorRes.json();
                setAuthorName(authorJson.name);
            }

        } catch (e: any)
        {
            setError(e.message);
        } finally
        {
            setLoading(false);
        }
    };

    const handleBarcodeScanned = ({ data }: { data: string }) =>
    {
        setScannedCode(data);
        setShowCamera(false);
        fetchBookData(data);
    };

    if (!permission)
    {
        return (
            <View style={styles.center}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted)
    {
        return (
            <View style={styles.center}>
                <Text>Camera access denied.</Text>
                <Text onPress={requestPermission} style={styles.link}>Grant Permission</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <View style={styles.container}>
                    <AppHeader onCameraPress={() => setShowCamera(true)} />

                    {showCamera ? (
                        <CameraScanner onScanned={handleBarcodeScanned} />
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
                            {error && <Text style={styles.error}>Error: {error}</Text>}

                            {bookData && (
                                <BookInfo bookData={bookData} authorName={authorName} />
                            )}

                            {scannedCode && !bookData && !loading && (
                                <Text style={styles.detail}>Scanned ISBN: {scannedCode}</Text>
                            )}
                        </ScrollView>
                    )}
                </View>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent:
    {
        alignItems: 'center',
        padding: 20,
    },
    center:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error:
    {
        color: 'red',
        marginTop: 20,
    },
    detail:
    {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
        textAlign: 'center',
    },
    link:
    {
        color: 'blue',
        marginTop: 10,
    },
});
