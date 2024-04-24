import React, {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {likeArrayState} from '../../utils/recoil/globalState';
import {Button, FlatList, Text, View} from 'react-native';
import {styles} from '../../utils/styleSheets';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {BackHandler} from 'react-native';

const Info = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [likeArray, _setLikeArray] = useRecoilState(likeArrayState);
    const partyNameArray = [
        ...new Set(likeArray.map(item => item.partyName)),
    ].map(item => {
        return {partyName: item, count: 0};
    });

    likeArray.forEach(element => {
        partyNameArray.forEach(item => {
            if (element.partyName === item.partyName) {
                item.count += 1;
            }
        });
    });
    partyNameArray.sort((a, b) => b.count - a.count);

    useEffect(() => {
        const backAction = () => true;

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.screen}>
            <FlatList
                data={partyNameArray}
                renderItem={({item, index}) => (
                    <View style={{margin: 10}}>
                        <Text style={styles.textColor}>
                            {index + 1}위 {item.partyName}
                            {item.count}개
                        </Text>
                    </View>
                )}></FlatList>
            <Button
                title="다시하기"
                onPress={() => navigation.navigate('Test')}
            />
        </View>
    );
};

export default Info;
