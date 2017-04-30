import {StyleSheet} from 'react-native'

export const commonStyles = StyleSheet.create({
    verticalAlign: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
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
    },
    infoTextContainer: {
        height: 35,
        flexGrow:1,
        justifyContent: 'center'
    },
    infoText: {
        textAlign:'center',
        fontSize: 16
    }
})

export const navigatorStyles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#009E8E',
        height: 50,
        marginTop: 20,
    },
    scene: {
        marginTop: 70,
    },
    leftNavBtn: {
        marginTop: -10,
        marginLeft: 5
    },
    rightNavBtn: {
        marginTop: -10,
        marginRight: 5
    },
    title: {
        marginTop: -15,
        marginLeft: 30,
        fontSize: 16,
        justifyContent: 'center',
        color: 'white',
    }
})