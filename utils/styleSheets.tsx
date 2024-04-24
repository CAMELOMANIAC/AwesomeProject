import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    checkBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        alignContent: 'center',
    },
    favoriteCheckBox: {flex: 0.5, flexDirection: 'row', alignItems: 'center'},
    card: {
        position: 'absolute',
        backgroundColor: 'gray',
        width: screenWidth * 0.9,
        height: screenHeight * 0.7,
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    cardContent: {flex: 1, justifyContent: 'flex-end'},
    cardBackcontent: {transform: [{rotateY: '-180deg'}]},
    textColor: {color: 'black'},
});
