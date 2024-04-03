import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {styles} from '../../utils/styleSheets';

const Home = ({
    navigation,
    extraData,
}: {
    navigation: NavigationProp<any>;
    extraData: number;
}) => {
    return (
        <View style={styles.screen}>
            <Text>Home Screen{extraData}</Text>
            <Text>안녕하세요</Text>
            <Button
                title="Go to Notice Screen"
                onPress={() => navigation.navigate('Notice')}
            />
            <Button
                title="Go to Test Screen"
                onPress={() => navigation.navigate('Test')}
            />
            <Button
                title="Go to Test 크롤링"
                onPress={() => navigation.navigate('Crawling')}
            />
            <Button
                title="Go to Test Survey"
                onPress={() => navigation.navigate('Survey')}
            />
        </View>
    );
};
export default Home;
