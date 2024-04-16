import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, Text, TouchableNativeFeedback, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Survey = ({navigation}: {navigation: NavigationProp<any>}) => {
    const [gender, setGender] = useState<string>();
    const [age, setAge] = useState<string>();
    const [isNotice, setIsNotice] = useState<boolean>(false);
    return (
        <View>
            <Text>
                성별, 나이로 추천하는 정보를 제공하기 위해 아래 항목을
                선택해주세요.
            </Text>
            <TouchableNativeFeedback onPress={() => setIsNotice(prev => !prev)}>
                <Text>
                    {isNotice
                        ? '네이버 트렌드 검색 api가 제공하는 값을 기준으로 함, 성별 나이를 선택하지 않을시 모든 성별, 나이를 기준으로 검색'
                        : '추천 정보 기준'}
                </Text>
            </TouchableNativeFeedback>
            <RNPickerSelect
                onValueChange={value => setGender(value)}
                placeholder={{label: '성별', value: null}}
                items={[
                    {label: '남성', value: 'm'},
                    {label: '여성', value: 'f'},
                ]}
            />
            <RNPickerSelect
                onValueChange={value => setAge(value)}
                placeholder={{label: '나이', value: null}}
                items={[
                    {label: '0~12', value: '1'},
                    {label: '13~18', value: '2'},
                    {label: '19~24', value: '3'},
                    {label: '25~29', value: '4'},
                    {label: '30~34', value: '5'},
                    {label: '35~39', value: '6'},
                    {label: '40~44', value: '7'},
                    {label: '45~49', value: '8'},
                    {label: '50~54', value: '9'},
                    {label: '55~59', value: '10'},
                    {label: '60세이상', value: '11'},
                ]}
            />
            <Button
                title="다음으로"
                onPress={() =>
                    navigation.navigate('Test', {gender: gender, age: age})
                }></Button>
        </View>
    );
};

export default Survey;
