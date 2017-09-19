import React, {Component} from 'react'
import {
    ListView,
    StyleSheet,
    TouchableHighlight,
    View
} from 'react-native';
import {ListItem} from 'react-native-material-ui'
import ModalWindow from './ModalWindow';
import NavigatorBar from './Navigator/NavigatorBar';

interface IProps {
    title: string,
    buttons: IModalMenuButton[],
    isOpened: boolean,
    closeModal: () => void
}

export interface IModalMenuButton {
    text: string,
    onPress: () => void
}

export default class ModalMenu extends Component<IProps, null> {
    renderNavigatorBar() {
        return (
            <NavigatorBar
                Title={'Действия с путешествием'}/>
        )
    }

    renderButton(button: IModalMenuButton) {
        return (
            <TouchableHighlight onPress={button.onPress}>
                <View>
                    <ListItem
                        divider={true}
                        centerElement={button.text}/>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const dataSource = ds.cloneWithRows(this.props.buttons)
        return (
            <ModalWindow
                isOpened={this.props.isOpened}
                closeModal={this.props.closeModal}
            >
                <View>
                    {this.renderNavigatorBar()}
                    <View style={styles.buttonsContainer}>
                        <ListView
                            dataSource={dataSource}
                            renderRow={this.renderButton}/>
                    </View>
                </View>
            </ModalWindow>
        )
    }
}

const styles = StyleSheet.create({
    buttonsContainer: {
        backgroundColor: 'white',
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: '#E6E6E6',
    }
})
