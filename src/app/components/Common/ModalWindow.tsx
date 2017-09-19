import React, {Component} from 'react'
import {
    Modal,
    StyleSheet,
    TouchableHighlight,
    View
} from 'react-native';

/**
 * isOpened Модальное окно открыто.
 * closeModal Закрыть модальное окно (вызывается при тапе на затемненную область).
 * width Ширина модального окна (по умолчанию 300)
 */
interface IProps {
    isOpened: boolean,
    closeModal: () => void,
    width?: number,
}

export default class ModalWindow extends Component<IProps, null> {
    static defaultProps: Partial<IProps> = {
        width: 300
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.isOpened}>
                    <TouchableHighlight
                        style={[styles.modal, styles.overlay]}
                        onPress={this.props.closeModal}>
                        <TouchableHighlight onPress={null} style={[styles.shadow, {width: this.props.width}]}>
                            {this.props.children}
                        </TouchableHighlight>
                    </TouchableHighlight>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -100
    },
    overlay: {
        backgroundColor: 'rgba(100, 100, 100, 0.5)',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    }
})
