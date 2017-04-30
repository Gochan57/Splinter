import React, {Component} from 'react'
import {View, TextInput} from 'react-native'
import appStyles from 'app/styles'

const styles = appStyles.commonStyles

export default class WideInput extends Component {

    /**
     * value Текст в инпуте.
     */
    state: {
       value: ''
    }

    /**
     * onChangeText Коллбэк на изменение текста.
     * placeholder Подсказка, отображающаяся при отстуствии значения в инпуте.
     * value Текст в инпуте (передается, если текст нужно спустить сверху).
     * textInputProps Свойства компонента TextInput.
     */
    propTypes: {
        onChangeText: React.propTypes.func.isRequired,
        placeholder: React.propTypes.string,
        value: React.propTypes.string,
        textInputProps: React.propTypes.object,
    }

    constructor (props) {
        super(props)
        this.state = {
            value: props.value
        }
    }

    _onChangeText = (text) => {
        this.setState({value: text})
        this.props.onChangeText(text)
    }

    render() {
        const {placeholder, textInputProps} = this.props
        const {value} = this.state
        return (
            <View>
                <TextInput
                    onChangeText={this._onChangeText}
                    placeholder={placeholder}
                    value={value}
                    style={styles.wideInput}
                    {...textInputProps}/>
            </View>
        )
    }
}