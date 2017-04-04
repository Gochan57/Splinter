import React, {Component} from 'react'
import {View, TextInput} from 'react-native'
import appStyles from 'app/styles'

const styles = appStyles.commonStyles

export default class WideInput extends Component {
    state: {
        value: ''
    }

    propTypes: {
        autoFocus: React.propTypes.boolean,
        onChangeText: React.propTypes.func.isRequired,
        placeholder: React.propTypes.string,
    }

    _onChangeText = (text) => {
        this.setState({value: text})
        this.props.onChangeText(text)
    }

    render() {
        const {autoFocus = true, placeholder} = this.props
        return (
            <View>
                <TextInput
                    autoFocus={autoFocus}
                    onChangeText={this._onChangeText}
                    placeholder={placeholder}
                    style={styles.wideInput}/>
            </View>
        )
    }
}