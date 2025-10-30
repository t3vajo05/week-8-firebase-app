import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App()
{
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);

    useEffect(() =>
    {
        if (!permission)
        {
            requestPermission();
        }
    }, [permission]);

    if (!permission)
    {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted)
    {
        return (
            <View style={styles.container}>
                <Text>Camera access denied.</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showCamera ? (
                <CameraView
                    style={styles.camera}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'ean8'], // EAN barcodes
                    }}
                    onBarcodeScanned={({ data }) =>
                    {
                        setScannedCode(data);
                        setShowCamera(false);
                    }}
                />
            ) : (
                <>
                    <Text style={styles.title}>EAN Barcode Scanner</Text>
                    {scannedCode ? (
                        <Text style={styles.result}>Scanned Code: {scannedCode}</Text>
                    ) : (
                        <Text style={styles.result}>No barcode scanned yet.</Text>
                    )}

                    <Button
                        title="Open Camera"
                        onPress={() =>
                        {
                            setScannedCode(null);
                            setShowCamera(true);
                        }}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    camera:
    {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    title:
    {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    result:
    {
        fontSize: 18,
        marginBottom: 20,
    },
});
