/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Notice from './components/page/Notice';
import Home from './components/page/Home';
import Test from './components/page/Test';
import Crawling from './components/page/Crawling';
import {RecoilRoot} from 'recoil';
import Survey from './components/page/Survey';
import Politic from './components/page/Politic';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Info from './components/page/Info';

export type RootStackParamList = {
    Home: undefined;
    Notice: {itemId: string};
    Test: undefined;
    Crawling: undefined;
    Survey: undefined;
    Politic: undefined;
    Info: undefined;
};

function App(): React.JSX.Element {
    const Stack = createNativeStackNavigator();

    return (
        <RecoilRoot>
            <GestureHandlerRootView>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home">
                            {props => <Home {...props} extraData={123} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="Notice"
                            component={Notice}
                            initialParams={{itemId: '처음에만되나?'}}
                        />
                        <Stack.Screen name="Test" component={Test} />
                        <Stack.Screen name="Crawling" component={Crawling} />
                        <Stack.Screen name="Survey" component={Survey} />
                        <Stack.Screen
                            name="Politic"
                            component={Politic}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="Info"
                            component={Info}
                            options={{headerShown: false}}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        </RecoilRoot>
    );
}

export default App;
