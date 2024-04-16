import React, {useEffect, useState} from 'react';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    State,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {PartyType} from './page/Test';
import {styles} from '../utils/styleSheets';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {useRecoilState} from 'recoil';
import {likeArrayState} from '../utils/recoil/globalState';

const PolicyCard = ({
    party,
    currentPolicy,
}: {
    party: PartyType;
    currentPolicy: number;
}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const [isFliped, setIsFliped] = useState<boolean>(false);
    const [isReveal, setIsReveal] = useState<boolean>(false);
    const [_likeArray, setLikeArray] = useRecoilState(likeArrayState);
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const rotateY = useDerivedValue(() => {
        if (isPressed) {
            //터치중일때는 플립 애니메이션을 적용하지 않는다.(애니메이션이 중복되면 하나의 애니메이션이 끝날때까지 다른 애니메이션이 실행되지 않으므로.)
            return isFliped ? 180 : 0;
        } else {
            return withSpring(isFliped ? 180 : 0);
        }
    });
    const animatedFlipStyles = useAnimatedStyle(() => {
        return {
            transform: [{rotateY: `${rotateY.value}deg`}, {perspective: 1000}],
        };
    });
    const animatedStyles = useAnimatedStyle(() => {
        if (isReveal) {
            return {
                transform: [
                    {translateX: withSpring(rotate.value > 0 ? 500 : -500)},
                    {translateY: translateY.value},
                    {rotate: `${rotate.value}deg`},
                    {rotateY: `${rotateY.value}deg`},
                ],
            };
        } else {
            return {
                transform: [
                    {translateX: translateX.value},
                    {translateY: translateY.value},
                    {rotate: `${rotate.value}deg`},
                    {rotateY: `${rotateY.value}deg`},
                ],
            };
        }
    });
    const likeTextStyles = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            top: 20,
            left: 20,
            transform: [{rotate: `-30deg`}],
            fontSize: 40,
            color:
                rotate.value < 0
                    ? `rgba(0,0,0,0)`
                    : `rgba(124,252,0,${Math.abs(rotate.value)})`,
        };
    });
    const nopeTextStyles = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            top: 20,
            right: 20,
            transform: [{rotate: `30deg`}],
            fontSize: 40,
            color:
                rotate.value < 0
                    ? `rgba(255,0,0,${Math.abs(rotate.value)})`
                    : `rgba(0,0,0,0)`,
        };
    });

    const onActive = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            setIsPressed(true);
            translateX.value = event.nativeEvent.translationX;
            translateY.value = event.nativeEvent.translationY;
            rotate.value = event.nativeEvent.translationX / 100;
        }
    };
    const onEnd = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.END) {
            setIsPressed(false);
            if (rotate.value > 1) {
                setIsReveal(true);
                currentPolicy === 0 && navigation.navigate('Info');
            } else if (rotate.value < -1) {
                setIsReveal(true);
                setLikeArray(prev => [...prev, party]);
                currentPolicy === 0 && navigation.navigate('Info');
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                rotate.value = withSpring(0);
            }
        }
    };
    const onEndTap = (event: TapGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.state === State.END) {
            setIsFliped(prev => !prev);
        }
    };

    //TapGestureHandler의 자식요소로Fragment요소를 사용하면 에러가 발생한다. 주의
    return (
        <TapGestureHandler onHandlerStateChange={onEndTap}>
            <PanGestureHandler
                onGestureEvent={onActive}
                onHandlerStateChange={onEnd}>
                <Animated.View
                    style={[styles.card, animatedStyles, animatedFlipStyles]}>
                    <Animated.View style={[styles.cardContent]}>
                        {party.prmsArray.map(prms => (
                            <View key={prms.prmsTitle}>
                                <Text style={styles.cardBackcontent}>
                                    {isFliped && prms.prmmCont}
                                </Text>
                                <Text>{!isFliped && prms.prmsTitle}</Text>
                            </View>
                        ))}
                    </Animated.View>

                    <Animated.Text style={[likeTextStyles]}>LIKE</Animated.Text>
                    <Animated.Text style={[nopeTextStyles]}>NOPE</Animated.Text>
                </Animated.View>
            </PanGestureHandler>
        </TapGestureHandler>
    );
};

export default PolicyCard;
