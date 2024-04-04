import {atom} from 'recoil';

export const partyNameState = atom<Array<string>>({
    key: 'partyNameState',
    default: [],
});
