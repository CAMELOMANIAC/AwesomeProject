import React, {useEffect, useState} from 'react';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    ScrollView,
    State,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {styles} from '../utils/styleSheets';
import {Text, View} from 'react-native';
import {useRecoilState} from 'recoil';
import {likeArrayState, revealCountState} from '../utils/recoil/globalState';
import {SplitPartyType} from './page/Politic';

const PolicyCard = ({
    party,
}: {
    party: SplitPartyType;
    currentPolicy: number;
}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const [isFliped, setIsFliped] = useState<boolean>(false);
    const [isReveal, setIsReveal] = useState<boolean>(false);
    const [_likeArray, setLikeArray] = useRecoilState(likeArrayState);
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [_revealCount, setRevealCount] = useRecoilState(revealCountState);

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

    const revealX = useDerivedValue(() => {
        if (isReveal) {
            return withSpring(rotate.value > 0 ? 500 : -500);
        } else return translateX.value;
    });
    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: revealX.value},
                {translateY: translateY.value},
                {rotate: `${rotate.value}deg`},
                {rotateY: `${rotateY.value}deg`},
            ],
        };
    });

    const isFlipedShared = useSharedValue(isFliped);
    useEffect(() => {
        isFlipedShared.value = isFliped;
    }, [isFliped]);

    const commonStyles: {
        justifyContent: 'center';
        padding: number;
        paddingLeft: number;
        top: number;
        borderWidth: number;
        fontSize: number;
        fontWeight: 'bold';
        margin: number;
    } = {
        justifyContent: 'center',
        padding: 2,
        paddingLeft: 10,
        top: 20,
        borderWidth: 4,
        fontSize: 40,
        fontWeight: 'bold',
        margin: 10,
    };

    const revealStandard = 5;
    const likeTextStyles = useAnimatedStyle(() => {
        return {
            ...commonStyles,
            borderColor: 'lime',
            transform: [
                {rotate: isFlipedShared.value ? `15deg` : `-15deg`},
                {rotateY: `${rotateY.value}deg`},
            ],
            opacity:
                rotate.value > 0 ? Math.abs(rotate.value) / revealStandard : 0,
            color: 'lime',
        };
    });

    const nopeTextStyles = useAnimatedStyle(() => {
        return {
            ...commonStyles,
            borderColor: 'red',
            transform: [
                {rotate: isFlipedShared.value ? `-15deg` : `15deg`},
                {rotateY: `${rotateY.value}deg`},
            ],
            opacity:
                rotate.value < 0 ? Math.abs(rotate.value) / revealStandard : 0,
            color: 'red',
        };
    });

    const onActive = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            setIsPressed(true);
            translateX.value = event.nativeEvent.translationX;
            translateY.value = event.nativeEvent.translationY;
            rotate.value = event.nativeEvent.translationX / 20;
        }
    };
    const onEnd = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.END) {
            setIsPressed(false);
            if (rotate.value > revealStandard) {
                setIsReveal(true);
                setTimeout(() => {
                    setLikeArray(prev => [...prev, party]);
                    setRevealCount(prev => prev + 1);
                    /*setLikeArray(prev => [...prev, party]);가 포함되면서 애니메이션이 늦게 동작하는 이유는 JavaScript의 이벤트 루프와 관련이 있을 수 있습니다.
JavaScript는 단일 스레드 언어이므로, 한 번에 하나의 작업만 처리할 수 있습니다. 따라서, setLikeArray(prev => [...prev, party]);와 같은 상태 업데이트 작업이 이벤트 큐에 추가되면, JavaScript는 현재 실행 중인 모든 동기적인 작업이 완료될 때까지 이 작업을 대기시킵니다.
이 경우, setLikeArray(prev => [...prev, party]);가 호출되면, 이 상태 업데이트는 이벤트 큐에 추가됩니다. 그런 다음, JavaScript는 현재 실행 중인 모든 동기적인 작업(예: 애니메이션)이 완료될 때까지 이 상태 업데이트를 대기시킵니다. 이로 인해 애니메이션이 늦게 시작될 수 있습니다.
이 문제를 해결하려면, setLikeArray(prev => [...prev, party]);를 setTimeout 내부에 넣어 이벤트 루프의 다음 틱에서 실행되도록 할 수 있습니다. 이렇게 하면, 현재 실행 중인 동기적인 작업이 완료된 후에 상태 업데이트가 실행됩니다. 
리액트는 최적화를 위해 별도의 이벤트큐를 이용해서 한꺼번에 렌더링함 자바스크립트상에서는 비동기적으로 하나씩 처리되어있지만 렌더링에서는 한꺼번에 처리되므로 setLikeArray와 setIsReveal가 동시에 실행된것처럼 보임 그러므로 일부러 실행될 틱을 나눠야 자연스럽게 보임*/
                }, 0);
            } else if (rotate.value < -revealStandard) {
                setIsReveal(true);
                setTimeout(() => {
                    setRevealCount(prev => prev + 1);
                }, 0);
            } else {
                translateX.value = withTiming(0, {duration: 500});
                translateY.value = withTiming(0, {duration: 500});
                rotate.value = withTiming(0, {duration: 500});
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
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            position: 'absolute',
                        }}>
                        {!isFliped ? (
                            <>
                                <Animated.Text style={[likeTextStyles]}>
                                    LIKE
                                </Animated.Text>
                                <Animated.Text style={[nopeTextStyles]}>
                                    NOPE
                                </Animated.Text>
                            </>
                        ) : (
                            <>
                                <Animated.Text style={[nopeTextStyles]}>
                                    NOPE
                                </Animated.Text>
                                <Animated.Text style={[likeTextStyles]}>
                                    LIKE
                                </Animated.Text>
                            </>
                        )}
                    </View>
                    {isFliped && (
                        <ScrollView key={party.prmsTitle}>
                            <Text style={styles.cardBackcontent}>
                                {party.prmsContent}
                            </Text>
                        </ScrollView>
                    )}
                    {!isFliped && (
                        <View style={[styles.cardContent]}>
                            <Text>{party.prmsTitle}</Text>
                        </View>
                    )}
                </Animated.View>
            </PanGestureHandler>
        </TapGestureHandler>
    );
};

export default PolicyCard;
