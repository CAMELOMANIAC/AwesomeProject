/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

const HomeScreen = ({
  navigation,
  extraData,
}: {
  navigation: NavigationProp<any>;
  extraData: number;
}) => {
  return (
    <View style={styles.screen}>
      <Text>Home Screen{extraData}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('next')}
      />
    </View>
  );
};

const NextScreen = ({
  navigation,
  route,
}: {
  navigation: NavigationProp<any> & {push: any};
  route: any;
}) => {
  const itemId = route.params?.itemId;
  return (
    <View style={styles.screen}>
      <Text>다음 Screen{itemId}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.push('next', {itemId: '지금은되나?'})}
      />
    </View>
  );
};

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home">
          {props => <HomeScreen {...props} extraData={123} />}
        </Stack.Screen>
        <Stack.Screen
          name="next"
          component={NextScreen}
          initialParams={{itemId: '처음에만되나?'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
