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
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {PartyType} from './page/Test';
import {styles} from '../utils/styleSheets';
import {Text, View} from 'react-native';

const PolicyCard = ({party}: {party: PartyType}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: translateX.value},
                {translateY: translateY.value},
                {rotate: `${rotate.value}deg`},
            ],
        };
    });

    const onActive = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            translateX.value = event.nativeEvent.translationX;
            translateY.value = event.nativeEvent.translationY;
            rotate.value = event.nativeEvent.translationX / 100;
        }
    };
    const onEnd = () => {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
    };

    const onEndTap = (event: TapGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.state === State.END) {
            setIsPressed(prev => !prev);
        }
    };

    useEffect(() => {
        console.log('isPressed', isPressed);
    }, [isPressed]);

    //TapGestureHandler의 자식요소로Fragment요소를 사용하면 에러가 발생한다. 주의
    return (
        <PanGestureHandler
            onGestureEvent={onActive}
            onHandlerStateChange={onEnd}>
            <Animated.View style={[styles.card, animatedStyles]}>
                <TapGestureHandler onHandlerStateChange={onEndTap}>
                    {isPressed ? (
                        <View>
                            <Text>{party.partyName}</Text>
                            {party.prmsArray.map(prms => (
                                <View key={prms.prmsTitle}>
                                    <Text>{prms.prmmCont}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <Text>{party.partyName}</Text>
                            {party.prmsArray.map(prms => (
                                <View key={prms.prmsTitle}>
                                    <Text>{prms.prmsTitle}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </TapGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    );
};

export default PolicyCard;
