import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {PartyType} from './Test';
import {styles} from '../../utils/styleSheets';
import PolicyCard from '../PolicyCard';
type props = {
    route?: {
        params: {
            checkedPrms: string[];
            partyArray: Array<PartyType>;
        };
    };
};
const Politic = ({route}: props) => {
    const [partyArray, setPartyArray] = useState<Array<PartyType>>([]);
    useEffect(() => {
        const filterdparty = route?.params.partyArray.filter(party =>
            route?.params.checkedPrms.some(checkedPrm =>
                party.prmsArray.some(prms =>
                    prms.prmsRealmName.includes(checkedPrm),
                ),
            ),
        );
        filterdparty?.forEach(party => {
            setPartyArray(prev => [
                ...prev,
                {
                    partyName: party.partyName,
                    prmsArray: party.prmsArray.filter(prms =>
                        route?.params.checkedPrms.some(checkedPrm =>
                            prms.prmsRealmName.includes(checkedPrm),
                        ),
                    ),
                },
            ]);
        });
    }, []);
    return (
        <View style={styles.screen}>
            {route?.params.checkedPrms.map(item => (
                <Text key={item}>{item}</Text>
            ))}
            {partyArray.map(party => (
                <PolicyCard key={party.partyName} party={party} />
            ))}
        </View>
    );
};

export default Politic;
