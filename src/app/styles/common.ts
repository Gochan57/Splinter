import {StyleSheet} from 'react-native'

export const commonStyles = StyleSheet.create({
    verticalCenter: {
        justifyContent: 'center'
    },
    horizontalCenter: {
        alignItems: 'flex-start'
    },
    horizontal: {
        flexDirection: 'row'
    },
    leftContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end'
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
        paddingLeft: 10
    },
    wideButtonPrimaryText: {
        color: 'white',
    },
    topViewContainer: {
        height: 35,
        paddingTop: 10
    },
    infoTextContainer: {
        height: 35,
        flexGrow: 1,
        justifyContent: 'center'
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16
    },
    flex: {
        flex: 1
    }
})