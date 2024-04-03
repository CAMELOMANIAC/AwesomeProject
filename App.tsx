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

function App(): React.JSX.Element {
    const Stack = createNativeStackNavigator();

    return (
        <RecoilRoot>
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
                    <Stack.Screen name="Politic" component={Politic} />
                </Stack.Navigator>
            </NavigationContainer>
        </RecoilRoot>
    );
}

export default App;
