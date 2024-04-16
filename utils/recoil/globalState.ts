import {atom} from 'recoil';
import {PartyType} from '../../components/page/Test';

export const partyNameState = atom<Array<string>>({
    key: 'partyNameState',
    default: [],
});

export const likeArrayState = atom<Array<PartyType>>({
    key: 'likeArrayState',
    default: [],
});
