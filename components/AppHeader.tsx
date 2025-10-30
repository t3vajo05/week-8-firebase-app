import React from 'react';
import { Appbar } from 'react-native-paper';

interface Props
{
    onCameraPress: () => void;
}

export default function AppHeader({ onCameraPress }: Props)
{
    return (
        <Appbar.Header style={{ backgroundColor: '#6200ee' }}> 
            <Appbar.Content title="Book Barcode Scanner" color="white" />
            <Appbar.Action icon="camera" onPress={onCameraPress} color="white" />
        </Appbar.Header>
    );
}
