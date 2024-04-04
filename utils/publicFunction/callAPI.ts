export type ResponseElectionPartyAPI = {
    response: {
        header: {
            resultCode: string;
            resultMsg: string;
        };
        body: {
            items: {
                item: Array<{
                    num: string;
                    sgId: string;
                    jdName: string;
                    pOrder: string;
                }>;
            };
            numOfRows: string;
            pageNo: string;
            totalCount: string;
        };
    };
};

export const callElectionPartyAPI = async (): Promise<
    ResponseElectionPartyAPI | Error
> => {
    const requestURL =
        'https://apis.data.go.kr/9760000/CommonCodeService/getCommonPartyCodeList?serviceKey=Q6l5h4ZqrcTtW6cmgfag%2BiaEuoidqsYLt6704hn8S9Ks4lkM86At69uABpAajduXy9TGRsrem1TaS%2BK%2BrSGpeg%3D%3D&pageNo=1&numOfRows=100&sgId=20240410&resultType=json';
    try {
        const response = await fetch(requestURL);
        const data = await response.json();
        if (!response.ok) throw new Error(data);
        return data;
    } catch (error) {
        return new Error(String(error));
    }
};

export type ResponsePartyPolicyAPI = {
    response: {
        header: {
            resultCode: string;
            resultMsg: string;
        };
        body: {
            items: {
                item: {
                    num: string;
                    sgId: string;
                    partyName: string;
                    prmsCnt: string;
                    prmsOrd1: string;
                    prmsRealmName1: string;
                    prmsTitle1: string;
                    prmmCont1: string;
                    prmsOrd2: string;
                    prmsRealmName2: string;
                    prmsTitle2: string;
                    prmmCont2: string;
                    prmsOrd3: string;
                    prmsRealmName3: string;
                    prmsTitle3: string;
                    prmmCont3: string;
                    prmsOrd4: string;
                    prmsRealmName4: string;
                    prmsTitle4: string;
                    prmmCont4: string;
                    prmsOrd5: string;
                    prmsRealmName5: string;
                    prmsTitle5: string;
                    prmmCont5: string;
                    prmsOrd6: string;
                    prmsRealmName6: string;
                    prmsTitle6: string;
                    prmmCont6: string;
                    prmsOrd7: string;
                    prmsRealmName7: string;
                    prmsTitle7: string;
                    prmmCont7: string;
                    prmsOrd8: string;
                    prmsRealmName8: string;
                    prmsTitle8: string;
                    prmmCont8: string;
                    prmsOrd9: string;
                    prmsRealmName9: string;
                    prmsTitle9: string;
                    prmmCont9: string;
                    prmsOrd10: string;
                    prmsRealmName10: string;
                    prmsTitle10: string;
                    prmmCont10: string;
                }[];
            };
            numOfRows: number;
            pageNo: number;
            totalCount: number;
        };
    };
};

export const callPartyPolicyAPI = async (
    partyName: string,
): Promise<ResponsePartyPolicyAPI | Error> => {
    const requestURL = `https://apis.data.go.kr/9760000/PartyPlcInfoInqireService/getPartyPlcInfoInqire?serviceKey=Q6l5h4ZqrcTtW6cmgfag%2BiaEuoidqsYLt6704hn8S9Ks4lkM86At69uABpAajduXy9TGRsrem1TaS%2BK%2BrSGpeg%3D%3D&pageNo=1&numOfRows=10&sgId=20240410&partyName=${encodeURIComponent(
        partyName,
    )}&resultType=json`;
    try {
        const response = await fetch(requestURL);
        const data = await response.json();
        if (!response.ok) throw new Error(data);
        if (!('items' in data.response.body)) {
            //통신에는 성공했으나 api에서 데이터를 제공하지 않는경우
            throw new Error('No data');
        }
        return data;
    } catch (error) {
        return new Error(String(error));
    }
};
