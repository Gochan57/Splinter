import {StyleSheet} from 'react-native'

export const commonStyles = StyleSheet.create({
    wideInput: {
        backgroundColor: '#FFCE73',
        height: 35,
        paddingLeft: 10
    },
    wideButtonContentViewContainer: {
        backgroundColor: '#FFA500',
        height: 35,
        paddingLeft: 10,
    },
    wideButtonPrimaryText: {
        color: 'white',
    }
})

export const navigatorStyles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#009E8E',
        height: 50,
    },
    scene: {
        marginTop: 50,
    },
    leftNavBtn: {
        marginLeft: 5
    },
    rightNavBtn: {
        marginRight: 5
    },
    title: {
        marginTop: 30,
        marginLeft: 30,
        fontSize: 16,
        justifyContent: 'center',
        color: 'white',
    }
})