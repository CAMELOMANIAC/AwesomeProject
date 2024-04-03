import React, {useEffect, useRef, useState} from 'react';
import {Button, Text, TouchableWithoutFeedback, View} from 'react-native';
import {str, str2} from '../../utils/publicData/partyData';
import CheckBox from '@react-native-community/checkbox';
import {styles} from '../../utils/styleSheets';
import {NavigationProp} from '@react-navigation/native';

type PrmsType = {prmsRealmName: string; prmsTitle: string; prmmCont: string};
type PartyType = {partyName: string; prmsArray: Array<PrmsType>};
type ResponseType = {
    response: {
        header: {resultCode: string; resultMsg: string};
        body: {items: {item: Array<any>}};
    };
};
type keywordObjectType = {keyword: string; ratio: number};
type keywordGroupsType = {
    groupName: string;
    keywords: Array<string>;
};
type props = {
    route?: {
        params: {
            age?: string;
            gender?: string;
        };
    };
    navigation?: NavigationProp<any>;
};

const Test = ({route, navigation}: props) => {
    const [party, setParty] = useState<Array<PartyType>>();
    const keyword = useRef<Array<string>>([]);
    const [keywordObject, setKeywordObject] = useState<
        Array<keywordObjectType>
    >([]);
    const sliceKeyword = useRef<Array<Array<string>>>([]);
    const [checkedPrms, setCheckedPrms] = useState<Array<string>>();

    useEffect(() => {
        console.log(route?.params);
        function pushPrmsTypeArray(
            responseObject: ResponseType,
        ): Array<PrmsType> {
            const prmsArray: PrmsType[] = [];
            const objectValueArray: any = Object.values(
                responseObject.response.body.items.item[0],
            );
            const objectKeyArray: any = Object.keys(
                responseObject.response.body.items.item[0],
            );

            for (let i = 1; i <= 10; i++) {
                if (objectValueArray[objectKeyArray.indexOf(`prmsOrd${i}`)]) {
                    prmsArray.push({
                        prmsRealmName:
                            objectValueArray[
                                objectKeyArray.indexOf(`prmsRealmName${i}`)
                            ],
                        prmsTitle:
                            objectValueArray[
                                objectKeyArray.indexOf(`prmsTitle${i}`)
                            ],
                        prmmCont:
                            objectValueArray[
                                objectKeyArray.indexOf(`prmmCont${i}`)
                            ],
                    });
                } else break;
            }
            return prmsArray;
        }

        setParty(prev =>
            prev
                ? [
                      ...prev,
                      {
                          partyName: str.response.body.items.item[0].partyName,
                          prmsArray: pushPrmsTypeArray(str),
                      },
                  ]
                : [
                      {
                          partyName: str.response.body.items.item[0].partyName,
                          prmsArray: pushPrmsTypeArray(str),
                      },
                  ],
        );

        setParty(prev =>
            prev
                ? [
                      ...prev,
                      {
                          partyName: str.response.body.items.item[0].partyName,
                          prmsArray: pushPrmsTypeArray(str2),
                      },
                  ]
                : [
                      {
                          partyName: str.response.body.items.item[0].partyName,
                          prmsArray: pushPrmsTypeArray(str2),
                      },
                  ],
        );
    }, []);

    useEffect(() => {
        const multipleArray: any[] = []; // 공공데이터포탈api로 받은 결과를 담을 배열
        party &&
            party.map(party =>
                multipleArray.push(
                    party.prmsArray.map(item => item.prmsRealmName),
                ),
            );
        const uniqueArray = [
            // 중복제거 및 필요없는 문자열 제거한 정보를 담을 배열
            ...new Set(
                multipleArray
                    .flat()
                    .flatMap((item: string) =>
                        item
                            .split(',')
                            .map(item =>
                                item
                                    .replaceAll(' ', '')
                                    .replaceAll('기타(', '')
                                    .replaceAll(')', ''),
                            ),
                    ),
            ),
        ];
        keyword.current = uniqueArray;

        if (keyword.current && keyword.current.length > 0) {
            //네이버 트렌드 api에 사용하기 적당하도록 키워드를 4개씩 묶어주는 코드
            for (let i = 0; i < keyword.current.length; i += 4) {
                sliceKeyword.current &&
                    sliceKeyword.current.push(keyword.current.slice(i, i + 4));
            }
            sliceKeyword.current = [
                //기준이 될만한 첫번째 키워드를 중복해서 넣어주는 코드
                ...sliceKeyword.current.map(item => [
                    keyword.current[0],
                    ...item,
                ]),
            ];
        }

        const callNaverTrend = async (
            keyword: string[],
        ): Promise<Array<keywordObjectType>> => {
            //네이버 트렌드 api 호출 함수
            const requestHeader = {
                'X-Naver-Client-Id': '9qEDbkByp1vTs0uBqi4H',
                'X-Naver-Client-Secret': 'yjFk7nOvVn',
                'Content-Type': 'application/json',
            };
            const requestURL = 'https://openapi.naver.com/v1/datalab/search';

            const requestBody = {
                startDate: '2023-03-01',
                endDate: '2024-03-01',
                timeUnit: 'month',
                gender: route?.params.gender || '',
                ...(route?.params.age ? {ages: [route.params.age]} : {}),
                keywordGroups: keyword.map(item => ({
                    groupName: item,
                    keywords: [item],
                })),
            };

            const response = await fetch(requestURL, {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify(requestBody),
            });
            const result = await response.json();
            if (response.ok) {
                return result.results.map((item: any) => ({
                    //12개월치 데이터를 평균내어 ratio로 반환
                    ratio:
                        item.data
                            .map((item: any) => item.ratio)
                            .reduce(
                                (accumulator: any, currentValue: any) =>
                                    accumulator + currentValue,
                                0,
                            ) / 12,
                    keyword: String(item.keywords),
                }));
            } else {
                throw new Error(JSON.stringify(result));
            }
        };

        Promise.all(sliceKeyword.current.map(item => callNaverTrend(item))) //네이버 트렌드 api를 반복해서 호출 후 결과를 keywordObject에 저장
            .then(results => {
                results.forEach((array, index) => {
                    //기준이 될 키워드와 비교할 키워드의 ratio를 비교하여 비율을 조정
                    const standardObject = results[0][0];
                    const standardRatio = results[index].find(
                        item => item.keyword === standardObject.keyword,
                    )!.ratio;
                    //만약 기준이 될 키워드의 ratio가 0이 아니라면 비율을 조정
                    standardRatio !== 0 &&
                        array.forEach(item => {
                            item.ratio =
                                item.ratio *
                                (standardObject.ratio / standardRatio);
                        });
                    const filterArray = array.filter(
                        item => item.keyword !== standardObject.keyword,
                    );
                    index === 0
                        ? setKeywordObject([standardObject, ...filterArray])
                        : setKeywordObject(prev => [...prev, ...filterArray]);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }, [party]);

    useEffect(() => {
        setKeywordObject(prev => prev.sort((a, b) => b.ratio - a.ratio));
    }, [keywordObject]);

    const pressHandler = (item: keywordObjectType) => {
        setCheckedPrms(prev =>
            prev?.includes(item.keyword)
                ? prev.filter(prms => prms !== item.keyword)
                : [...(prev || []), item.keyword],
        );
    };

    return (
        <View>
            <Text>비교하고 싶은 정책을 선택해주세요</Text>
            {keywordObject ? (
                keywordObject.map(item => (
                    <TouchableWithoutFeedback
                        key={item.keyword}
                        onPress={() => pressHandler(item)}>
                        <View style={styles.checkBox}>
                            <CheckBox
                                value={checkedPrms?.includes(item.keyword)}
                                onValueChange={() => pressHandler(item)}
                            />
                            <Text>
                                {item.keyword}
                                {item.ratio}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))
            ) : (
                <Text>abs</Text>
            )}

            <Button
                onPress={() =>
                    navigation?.navigate('Politic', {checkedPrms: checkedPrms})
                }
                title="다음으로"
            />
        </View>
    );
};

export default Test;

// const callAPI = async () => {
//     const requestURL =
//         'https://apis.data.go.kr/9760000/PartyPlcInfoInqireService/getPartyPlcInfoInqire?serviceKey=Q6l5h4ZqrcTtW6cmgfag%2BiaEuoidqsYLt6704hn8S9Ks4lkM86At69uABpAajduXy9TGRsrem1TaS%2BK%2BrSGpeg%3D%3D&pageNo=1&numOfRows=10&sgId=20240410&partyName=%EB%8D%94%EB%B6%88%EC%96%B4%EB%AF%BC%EC%A3%BC%EB%8B%B9&resultType=json';
//     try {
//         const response = await fetch(requestURL);
//         const data = await response.json();
//         setParty(JSON.stringify(data));
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };
