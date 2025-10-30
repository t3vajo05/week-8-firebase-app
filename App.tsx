import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import ScannerScreen from './screens/ScannerScreen';
import BookshelfScreen from './screens/BookshelfScreen';
import AppHeader from './components/AppHeader';

export type RootStackParamList = {
    Scanner: undefined;
    Bookshelf: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App()
{
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Scanner"
                    screenOptions={({ navigation, route }) => ({
                        header: (props) => (
                            <AppHeader navigation={navigation} back={props.back} />
                        ),
                    })}
                >
                    <Stack.Screen name="Scanner" component={ScannerScreen} />
                    <Stack.Screen name="Bookshelf" component={BookshelfScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
