import React from 'react';
import {useRecoilState} from 'recoil';
import {likeArrayState} from '../../utils/recoil/globalState';
import {Button, FlatList, Text, View} from 'react-native';
import {styles} from '../../utils/styleSheets';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

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

    return (
        <View style={styles.screen}>
            <FlatList
                data={partyNameArray}
                renderItem={({item, index}) => (
                    <View>
                        <Text>
                            {index + 1}위 {item.partyName}
                            {item.count}개
                        </Text>
                    </View>
                )}></FlatList>
            <Button
                title="처음으로"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
};

export default Info;
