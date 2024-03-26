import React, {useEffect, useState} from 'react';
import cheerio from 'cheerio';
import {View, Text} from 'react-native';

const Crawling = () => {
    const [text, setText] = useState('');
    const menuName = encodeURIComponent('제8회 전국동시지방선거');

    const fetchData = async () => {
        try {
            const response = await fetch('https://policy.nec.go.kr/', {
                method: 'GET',
                headers: {
                    Cookie: 'WMONID=zh5Vl4acsy8; JSESSIONID=wIyCICS8BVN01ym4OaHQ0o1YEdxA8bwSD2N2IOv7pPAZT95Wzm5waIfEdx2RnVg7.elecapp6_servlet_engine3',
                },
                // body: JSON.stringify({
                //     sgId: 20240410,
                //     jdid: 100,
                //     jdname: '더불어민주당',
                //     sgName: '제22대 국회의원선거',
                // }),
            });
            const body = await response.text();
            console.error(body);
            return cheerio.load(body);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchAndSetData = async () => {
            const $ = await fetchData();
            const fetchedText = $(
                'html > body > div > div > div > div > div:nth-child(2) > div > p',
            ).text();
            setText(fetchedText);
        };

        fetchAndSetData();
    }, []);

    return (
        <View>
            <Text>{text}</Text>
        </View>
    );
};

export default Crawling;
