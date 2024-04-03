import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {styles} from '../../utils/styleSheets';

const Notice = ({
    navigation,
    route,
}: {
    navigation: NavigationProp<any> & {push: any};
    route: any;
}) => {
    const itemId = route.params?.itemId;
    const [result, setResult] = useState<string>();

    const prompt = `□ 이행방법 및 이행기간 ① 저출생 문제 해결 위한 부총리급 '인구부' 신설 - 여러 부처에 흩어진 저출생 정책을 인구부로 통합하여 국가 차원의 저출생 문제 대응 - 안정적인 저출생 대응 재원 마련 위해 '저출생대응특별회계' 신설 ② 일하는 부모에게 아이와 함께할 충분한 시간 제공 - 아빠휴가(배우자 출산휴가) 1개월(유급) 의무화 - 엄마·아빠휴가 및 육아휴직을 신청만으로 자동개시 - 육아휴직 급여 상한 인상(150만원->210만원) 및 사후지급금 즉각 폐지 - 초3까지 유급 자녀돌봄휴가 신설 - 배우자에게도 임신 중 육아휴직 사용 허용 ③ 육아기 유연근무를 기업 문화로 정착 - 육아기 유연근무 취업규칙 등 정기적 공지 의무화 - 육아기 근로시간 단축 급여 상한 인상 - 중소기업 육아휴직 동료 업무대행하는 육아 동료수당 활용 활성화 - 가족친화 우수 중소기업 법인세 감면 □ 재원조달방안 - 고용부의 고용보험기금 재원 활용 (2024년 현재 고용보험기금 현금성자산 보유액 7조원 규모, 이 중 모성보호급여가 포함된 실업급여계정의 현금성자산은 4조원)    `;

    useEffect(() => {
        const callClovaSummary = async () => {
            const requestHeader = {
                'X-NCP-APIGW-API-KEY-ID': '4iklrf2i0r',
                'X-NCP-APIGW-API-KEY':
                    'aF2nO8Q4opyvpTANQgUwovj70ULHLfUQaztOk7wy',
                'Content-Type': 'application/json',
            };
            const requestURL =
                'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize';

            const requestBody = {
                document: {
                    content: prompt,
                },
                option: {
                    language: 'ko',
                },
            };
            try {
                const response = await fetch(requestURL, {
                    method: 'POST',
                    headers: requestHeader,
                    body: JSON.stringify(requestBody),
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error:', error);
            }
        };
        callClovaSummary().then(data => {
            setResult(data.summary);
        });
    }, [prompt]);

    return (
        <View style={styles.screen}>
            <Text>다음 Screen{itemId}</Text>
            {/* <Text>{result?.generations[0].text}</Text> */}
            <Text>{result}</Text>
            <Button
                title="Go to Next Screen"
                onPress={() => navigation.push('next', {itemId: '지금은되나?'})}
            />
            <Button
                title="Go to Home Screen"
                onPress={() => navigation.navigate('home')}
            />
        </View>
    );
};

export default Notice;
