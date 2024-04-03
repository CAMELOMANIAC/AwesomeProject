import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Survey = ({navigation}: {navigation: NavigationProp<any>}) => {
    const [gender, setGender] = useState<string>();
    const [age, setAge] = useState<string>();
    return (
        <View>
            <Text>
                성별, 나이로 추천하는 정보를 제공하기 위해 아래 항목을
                선택해주세요. 선택하지 않는다면 평균으로 추천합니다.
            </Text>
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
