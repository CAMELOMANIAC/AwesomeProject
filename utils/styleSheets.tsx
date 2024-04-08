import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    checkBox: {flexDirection: 'row', alignItems: 'center'},
    card: {
        position: 'absolute',
        backgroundColor: 'gray',
        width: screenWidth - 40,
        height: screenHeight - 40,
        borderRadius: 10,
        padding: 10,
        margin: 10,
        justifyContent: 'flex-end',
    },
});
