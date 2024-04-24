import {atom} from 'recoil';
import {SplitPartyType} from '../../components/page/Politic';

export const partyNameState = atom<Array<string>>({
    key: 'partyNameState',
    default: [],
});

export const likeArrayState = atom<Array<SplitPartyType>>({
    key: 'likeArrayState',
    default: [],
});

export const revealCountState = atom<number>({
    key: 'revealCountState',
    default: 0,
});
