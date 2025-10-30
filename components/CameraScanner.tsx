import React from 'react';
import { StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';

interface Props
{
    onScanned: ({ data }: { data: string }) => void;
}

export default function CameraScanner({ onScanned }: Props)
{
    return (
        <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
            onBarcodeScanned={onScanned}
        />
    );
}

const styles = StyleSheet.create({
    camera:
    {
        flex: 1,
        width: '100%',
    },
});
