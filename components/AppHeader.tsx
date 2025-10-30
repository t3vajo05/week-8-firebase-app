import React from 'react';
import { Appbar } from 'react-native-paper';

interface Props
{
    navigation: any;
    back: any;
}

export default function AppHeader({ navigation, back }: Props)
{
    const isScanner = navigation.getState().routes.slice(-1)[0].name === 'Scanner';

    return (
        <Appbar.Header style={{ backgroundColor: '#1e88e5' }}>
            {back ? (
                <Appbar.BackAction onPress={navigation.goBack} color="white" />
            ) : null}

            <Appbar.Content title={isScanner ? 'Book Scanner' : 'My Bookshelf'} color="white" />

            {isScanner ? (
                <Appbar.Action icon="bookshelf" color="white" onPress={() => navigation.navigate('Bookshelf')} />
            ) : (
                <Appbar.Action icon="camera" color="white" onPress={() => navigation.navigate('Scanner')} />
            )}
        </Appbar.Header>
    );
}
