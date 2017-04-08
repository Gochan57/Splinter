import React, {Component} from 'react'
import {View, Text, ListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {toArrayWithKeys} from 'app/utils/utils'
import {goTo} from 'app/components/Common/SNavigator'
import WideButton from 'app/components/Common/WideButton'
import PaymentsScene from '../Payment/PaymentsScene';
import TripItem from './TripItem'
import CreateNewTripScene from './CreateNewTripScene'

class TripsScene extends Component {

    // Отображается в строке навигатора
    static title = 'Путешествия'

    /**
     * @prop items - store.trips
     * @prop navigator - Навигатор.
     */
    propTypes: {
        items: React.PropTypes.object,
        navigator: React.propTypes.object,
    }

    _toPaymentsScene = (tripId) => {
        const {items, navigator} = this.props
        const passProps = {
            tripId,
            payments: items[tripId].payments
        }
        return () => {
            goTo({
                navigator,
                component: PaymentsScene,
                props: passProps,
                title: items[tripId].name
            })
        }
    }

    _toAddTripScene = () => {
        const {navigator} = this.props
        goTo({
            navigator,
            component: CreateNewTripScene,
            rightBtnOK: true
        })
    }

    _renderTripItem = (rowData) => {
        return (
            <TripItem name={rowData.name} onPress={this._toPaymentsScene(rowData.id)}/>
        )
    }

    render(){
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
    console.log('trips:', state.trips)
    return {items: state.trips}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsScene)
