import React from 'react';
import {Text, View} from 'react-native';

type props = {
    route?: {
        params: {
            checkedPrms: string[];
        };
    };
};
const Politic = ({route}: props) => {
    console.log(route?.params.checkedPrms);
    return (
        <View>
            {route?.params.checkedPrms.map(item => (
                <Text>{item}</Text>
            ))}
        </View>
    );
};

export default Politic;
