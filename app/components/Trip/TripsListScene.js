import React, {Component} from 'react'
import {View, Text, ListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {toArrayWithKeys} from 'app/utils/utils'
import {goTo} from 'app/components/Common/SNavigator'
import WideButton from 'app/components/Common/WideButton'
import PaymentsListScene from '../Payment/PaymentsListScene';
import TripsListItem from './TripsListItem'
import TripScene from './TripScene'

/**
 * Экран со списком путешествий.
 */
class TripsListScene extends Component {

    // Отображается в строке навигатора
    static title = 'Путешествия'

    /**
     * @prop items - store.trips
     * @prop navigator Навигатор для переходов на другие экраны.
     */
    static propTypes = {
        items: React.PropTypes.object,
        navigator: React.PropTypes.object,
    }

    _toPaymentsListScene = (tripId) => {
        const {items, navigator} = this.props
        const passProps = {
            tripId,
        }
        return () => {
            goTo({
                navigator,
                component: PaymentsListScene,
                props: passProps,
                title: items[tripId].name
            })
        }
    }

    _toAddTripScene = () => {
        const {navigator} = this.props
        goTo({
            navigator,
            component: TripScene,
            rightBtnOK: true
        })
    }

    _renderTripItem = (rowData) => {
        return (
            <TripsListItem name={rowData.name} onPress={this._toPaymentsListScene(rowData.id)}/>
        )
    }

    render() {
        const {items, navigator} = this.props

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const rows = toArrayWithKeys(items)
        const dataSource = ds.cloneWithRows(rows)

        return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <ListView
                    dataSource={dataSource}
                    renderRow={this._renderTripItem}
                />
                <WideButton text={'Новое путешествие'} onPress={this._toAddTripScene} addBtn={true}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {items: state.trips}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsListScene)