import {NavigationProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {styles} from '../../utils/styleSheets';
import {
    callElectionPartyAPI,
    ResponseElectionPartyAPI,
} from '../../utils/publicFunction/callAPI';
import {useRecoilState} from 'recoil';
import {partyNameState} from '../../utils/recoil/globalState';

const Home = ({
    navigation,
    extraData,
}: {
    navigation: NavigationProp<any>;
    extraData: number;
}) => {
    const [partyList, setPartyList] = useRecoilState(partyNameState);

    useEffect(() => {
        //22대 총선 참여 정당 정보 가져오기
        const response = async () => {
            const result: ResponseElectionPartyAPI | Error =
                await callElectionPartyAPI();
            if ('response' in result) {
                console.log(result.response.body.totalCount);
            }
            return result;
        };
        const result = response();
        result.then(item => {
            if ('response' in item) {
                setPartyList(
                    item.response.body.items.item.map(item => item.jdName),
                );
            }
        });
    }, []);

    return (
        <View style={styles.screen}>
            <Text>Home Screen{extraData}</Text>
            <Text>2024 대한민국 22대 총선 정당별 정책 블라인드 테스트</Text>
            <Text>정당 별 정책을 블라인드 테스트해보세요</Text>
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
                title={`${partyList.length}개 정당의 공약을 확인해볼까요?`}
                onPress={() => navigation.navigate('Survey')}
            />
        </View>
    );
};
export default Home;
