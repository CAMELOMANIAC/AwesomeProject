import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    Button,
    FlatList,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {styles} from '../../utils/styleSheets';
import {NavigationProp} from '@react-navigation/native';
import {
    KeywordObjectType,
    ResponsePartyPolicyAPI,
    callNaverTrend,
    callPartyPolicyAPI,
} from '../../utils/publicFunction/callAPI';
import {useRecoilState} from 'recoil';
import {partyNameState} from '../../utils/recoil/globalState';

type PrmsType = {prmsRealmName: string; prmsTitle: string; prmmCont: string};
export type PartyType = {partyName: string; prmsArray: Array<PrmsType>};
type ResponseType = {
    response: {
        header: {resultCode: string; resultMsg: string};
        body: {items: {item: Array<any>}};
    };
};
type Props = {
    route?: {
        params: {
            age?: string;
            gender?: string;
        };
    };
    navigation?: NavigationProp<any>;
};

const Test = ({route, navigation}: Props) => {
    const keyword = useRef<Array<string>>([]);
    const [keywordObject, setKeywordObject] = useState<
        Array<KeywordObjectType>
    >([]);
    const sliceKeyword = useRef<Array<Array<string>>>([]);
    const [checkedPrms, setCheckedPrms] = useState<Array<string>>();
    const [partyName, _setPartyName] = useRecoilState(partyNameState);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const partyArray = useRef<Array<PartyType>>([]);

    useEffect(() => {
        function pushPrmsArray(responseObject: ResponseType): Array<PrmsType> {
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
        //공약정보를 partyType으로 만들어주는 함수
        function createParty(response: ResponsePartyPolicyAPI): PartyType {
            return {
                partyName: response.response.body.items.item[0].partyName,
                prmsArray: pushPrmsArray(response),
            };
        }
        //정당이름으로 공약정보를 받아오는 api 호출
        const partyPolicyPromise = partyName.map(item =>
            callPartyPolicyAPI(item),
        );

        Promise.all(partyPolicyPromise).then(results => {
            const multipleArray: any[] = []; // 공공데이터포탈api로 받은 결과를 담을 배열
            results.forEach(item => {
                if (item instanceof Error) return;

                partyArray.current.push(createParty(item));
            });

            partyArray.current &&
                partyArray.current.map(party =>
                    multipleArray.push(
                        party.prmsArray.map(item => item.prmsRealmName),
                    ),
                );

            const uniqueArray = [
                // 중복제거 및 필요없는 문자열 제거한 정보를 담을 배열
                ...new Set(
                    multipleArray.flat().flatMap((item: string) =>
                        item
                            .split(/[.,/,·]/)
                            .map(item =>
                                item
                                    .replaceAll('기타(', '')
                                    .replaceAll(' ', '')
                                    .replaceAll(')', ''),
                            )
                            .filter(item => item.length > 0),
                    ),
                ),
            ];
            keyword.current = uniqueArray;

            if (keyword.current && keyword.current.length > 0) {
                //네이버 트렌드 api에 사용하기 적당하도록 키워드를 4개씩 묶어주는 코드
                for (let i = 0; i < keyword.current.length; i += 4) {
                    sliceKeyword.current &&
                        sliceKeyword.current.push(
                            keyword.current.slice(i, i + 4),
                        );
                }
                sliceKeyword.current = [
                    //기준이 될만한 첫번째 키워드를 중복해서 넣어주는 코드
                    ...sliceKeyword.current.map(item => [
                        keyword.current[0],
                        ...item,
                    ]),
                ];
            }

            route &&
                Promise.all(
                    sliceKeyword.current.map(item =>
                        callNaverTrend(item, route),
                    ),
                ) //네이버 트렌드 api를 반복해서 호출 후 결과를 keywordObject에 저장
                    .then(results => {
                        setIsLoading(false);
                        results.forEach((array, index) => {
                            //기준이 될 키워드와 비교할 키워드의 ratio를 비교하여 비율을 조정
                            const standardObject = results[0][0];
                            const standardRatio = results[index].find(
                                (item: any) =>
                                    item.keyword === standardObject.keyword,
                            )!.ratio;
                            //만약 기준이 될 키워드의 ratio가 0이 아니라면 비율을 조정
                            standardRatio !== 0 &&
                                array.forEach((item: any) => {
                                    item.ratio =
                                        item.ratio *
                                        (standardObject.ratio / standardRatio);
                                });
                            const filterArray = array.filter(
                                (item: any) =>
                                    item.keyword !== standardObject.keyword,
                            );
                            index === 0
                                ? setKeywordObject([
                                      standardObject,
                                      ...filterArray,
                                  ])
                                : setKeywordObject(prev => [
                                      ...prev,
                                      ...filterArray,
                                  ]);
                        });
                    })
                    .catch(error => {
                        setIsLoading(false);
                        console.error(error);
                        Alert.alert(
                            '죄송합니다',
                            '일일 api 최대한도에 도달했습니다\n직접 정책 키워드를 선택하거나\n내일 다시 시도하십시오',
                        );
                        setKeywordObject(
                            keyword.current.map(item => {
                                return {keyword: item, ratio: 0};
                            }),
                        );
                    });
        });
    }, []);

    useEffect(() => {
        setKeywordObject(prev => prev.sort((a, b) => b.ratio - a.ratio));
    }, [keywordObject]);

    const pressHandler = (item: KeywordObjectType) => {
        setCheckedPrms(prev =>
            prev?.includes(item.keyword)
                ? prev.filter(prms => prms !== item.keyword)
                : [...(prev || []), item.keyword],
        );
    };

    return (
        <View style={styles.screen}>
            <Text>비교하고 싶은 정책을 선택해주세요</Text>
            {isLoading ? (
                <Text>로딩중</Text>
            ) : (
                <FlatList
                    data={keywordObject}
                    keyExtractor={item => item.keyword}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback
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
                    )}
                />
            )}
            {isLoading === false && (
                <Button
                    onPress={() =>
                        checkedPrms && checkedPrms.length > 1
                            ? navigation?.navigate('Politic', {
                                  checkedPrms: checkedPrms,
                                  partyArray: partyArray.current,
                              })
                            : Alert.alert(
                                  '2개 이상의 관심 키워드를 선택해주세요',
                              )
                    }
                    title="다음으로"
                />
            )}
        </View>
    );
};
export default Test;
