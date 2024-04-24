import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {PartyType} from './Test';
import {styles} from '../../utils/styleSheets';
import PolicyCard from '../PolicyCard';
import {likeArrayState, revealCountState} from '../../utils/recoil/globalState';
import {useRecoilState} from 'recoil';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
type props = {
    route?: {
        params: {
            checkedPrms: string[];
            partyArray: Array<PartyType>;
        };
    };
};

export type SplitPartyType = {
    partyName: string;
    prmsTitle: string;
    prmsContent: string;
};
const Politic = ({route}: props) => {
    const [_likeArray, setLikeArray] = useRecoilState(likeArrayState);
    const partyArray = useRef<Array<PartyType>>([]);
    const [splitPartyArray, setSplitPartyArray] = useState<
        Array<SplitPartyType>
    >([]);
    const [revealCount, setRevealCount] = useRecoilState(revealCountState);

    useEffect(() => {
        //현재 페이지에 진입하면 초기화
        setLikeArray([]);
        setRevealCount(0);
        //정당정책을 카드로 변환하기 위한 과정
        const filterdparty = route?.params.partyArray.filter(
            (
                party, //우선 정당을 적당한 객체로 변환
            ) =>
                route?.params.checkedPrms.some(checkedPrm =>
                    party.prmsArray.some(prms =>
                        prms.prmsRealmName.includes(checkedPrm),
                    ),
                ),
        );
        filterdparty?.forEach(party => {
            //그리고 체크된 값으로 필터링
            partyArray.current.push({
                partyName: party.partyName,
                prmsArray: party.prmsArray.filter(prms =>
                    route?.params.checkedPrms.some(checkedPrm =>
                        prms.prmsRealmName.includes(checkedPrm),
                    ),
                ),
            });
        });
    }, []);

    useEffect(() => {
        //그리고 다시 정책마다 쪼개기
        partyArray.current.forEach(party => {
            party.prmsArray.forEach(prms => {
                setSplitPartyArray(prev => [
                    ...prev,
                    {
                        partyName: party.partyName,
                        prmsTitle: prms.prmsTitle,
                        prmsContent: prms.prmmCont,
                    },
                ]);
            });
        });
        //그리고 섞기
        setSplitPartyArray(prev => prev.sort(() => Math.random() - 0.5));
    }, [partyArray]);

    const screenWidth = Dimensions.get('window').width;
    const revealCountShared = useSharedValue(revealCount);
    useEffect(() => {
        revealCountShared.value = revealCount;
    }, [revealCount]);
    const ratio = useDerivedValue(() => {
        if (splitPartyArray.length === 0) {
            return 0;
        }
        return withTiming(revealCountShared.value / splitPartyArray.length, {
            duration: 500,
        });
    });
    const widthResizeStyles = useAnimatedStyle(() => {
        return {
            width: screenWidth * ratio.value,
            backgroundColor: 'red',
            height: 15,
        };
    });

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    //모든 정책을 다 봤을때 정보 페이지로 이동

    if (splitPartyArray.length > 0 && revealCount === splitPartyArray.length) {
        setTimeout(() => {
            navigation.navigate('Info');
        }, 100);
    }
    useEffect(() => {}, [revealCount]);

    return (
        <View style={styles.screen}>
            {route?.params.checkedPrms.map(item => (
                <Text key={item}>{item}</Text>
            ))}
            {splitPartyArray.map((party, index) => (
                <PolicyCard
                    key={party.prmsContent}
                    party={party}
                    currentPolicy={index}
                />
            ))}

            <View
                style={{
                    backgroundColor: 'grey',
                    width: screenWidth,
                    height: 15,
                    position: 'absolute',
                    bottom: 0,
                }}>
                <Animated.View style={[widthResizeStyles]}></Animated.View>
            </View>
        </View>
    );
};

export default Politic;
