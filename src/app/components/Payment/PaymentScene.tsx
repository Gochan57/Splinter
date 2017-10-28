import React, {
    Component,
} from 'react'
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    View,
    TouchableHighlight,
    NavigatorStatic,
    TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as paymentActions from 'app/thunk/payments'
import {toNumber, toNumberNullable} from 'app/utils/utils'
import appStyles from 'app/styles'

import NavigatorBar, {IconType, button} from 'app/components/Common/Navigator/NavigatorBar'
import WideButton from 'app/components/Common/WideButton'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMember from './PaymentMember'
import MembersListScene, {IMemberItem} from 'app/components/Member/MembersListScene'
import {
    IMember,
    IPayment,
    IPaymentActions
} from 'app/models/payments'
import {
    IKey,
    IStore
} from 'app/models/common'
import {IPerson} from 'app/models/people'
import ModalWindow from '../Common/ModalWindow';

import * as _ from 'lodash'
import {ITrip} from '../../models/trips';
import {objectify} from '../../utils/objectify';

const commonStyles = appStyles.commonStyles

/**
 * navigator Навигатор для перехода на другие экраны.
 * tripId Идентификатор путешествия.
 */
export interface IPaymentSceneProps {
    navigator: NavigatorStatic,
    tripId: string,
    paymentId?: string
}

/**
 * paymentId Идентификатор счета.
 * loading Страница загружается.
 * name Название счета.
 * spentEqually Потратили одинаково?
 * paidOne Платил один?
 * sum Общая сумма счета.
 * members Участника счета.
 * tripMembers Участники путешествия.
 * totalRow Строка итого.
 */
interface IStateProps {
    trip?: ITrip,
    tripMembers?: IPerson[],
    paymentId?: string,
    loading?: boolean,
    name?: string,
    spentEqually?: boolean,
    paidOne?: boolean,
    sum?: number,
    members?: (IMember & IKey)[],
    totalRow?: IMember & IKey,
}

interface IDispatchProps extends IPaymentActions {}

/**
 * chooseMembersModalVisible Отображать модальное окно с выбором участников счета.
 */
interface IState {
    chooseMembersModalVisible: boolean
}

/**
 * Экран просмотра/добавления/редактирования счета.
 */
class PaymentScene extends Component<IPaymentSceneProps & IStateProps & IDispatchProps, IState> {
    static defaultProps: Partial<IStateProps> = {
        loading: false,
        name: '',
        spentEqually: false,
        paidOne: false,
        sum: null,
        members: [],
    }

    state: IState = {
        chooseMembersModalVisible: false
    }

    // Хак против ts. Без переопределения refs с any нет возможности вызвать blur.
    refs: {[key: string]: any}

    /**
     * Строка "Итого"
     */
    private totalRow: PaymentMember = null

    /**
     * Снять фокус со всех инпутов.
     */
    endEditingAllInputs = () => {
        const {members} = this.props
        this.totalRow.blur()
        _.forEach(members, member => {
            // приходится обращаться ко второму refs через литерал, так как по какой-то причине в тайпингах поле refs возвращает ReactInstance
            this.refs.list.refs[this.refFor(member.key)].blur()
        })
    }

    /**
     * Показать/скрыть модальное окно с выбором участников счета.
     * @param visible
     */
    setChooseMembersModalVisible = (visible) => {
        this.setState({chooseMembersModalVisible: visible})
    }

    componentWillMount () {
        // Вызовем action начала редактирования/создания нового счета
        const {trip, paymentId} = this.props
        if (paymentId) {
            this.props.startUpdatingPayment(paymentId)
        }
        else {
            this.props.startCreatingNewPayment(trip)
        }
    }

    componentWillUnmount () {
        this.props.cancelUpdatingPayment()
    }

    renderNavigatorBar = () => {
        const {tripId, name, navigator} = this.props
        const leftButton = button(IconType.BACK, () => {navigator.pop()})
        const title = name || 'Новый счет'
        const rightButton = button(IconType.OK, () => {
            this.props.updatePayment(tripId)
            this.props.navigator.pop()
        })
        return (
            <NavigatorBar
                LeftButton={leftButton}
                Title={title}
                RightButton={rightButton}
            />
        )
    }

    renderMemberRow = (rowData: IMember & IKey) => {
        if (rowData.key === 'totalRow') {
            // Верхняя строка с общим счетом "Итого"
            return (
                <PaymentMember
                    name={rowData.person.name}
                    spent={toNumberNullable(rowData.spent)}
                    paid={toNumberNullable(rowData.paid)}
                    spentEditable={this.props.spentEqually}
                    paidEditable={false}
                    onSpentChanged={this.props.changeSumOnPayment}
                    spentPlaceholder={null}
                    paidPlaceholder={null}
                    style={styles.totalRowStyle}
                    customLabelStyle={styles.totalRowLabelStyle}
                    customSpentStyle={styles.totalRowSpentStyle}
                    customPaidStyle={styles.totalRowPaidStyle}
                    key={rowData.key}
                    ref={(ref) => {this.totalRow = ref}}/>
            )
        }
        return (
            <PaymentMember
                name={rowData.person.name}
                spent={toNumberNullable(rowData.spent)}
                paid={toNumberNullable(rowData.paid)}
                spentEditable={!this.props.spentEqually}
                paidEditable={!this.props.paidOne}
                onSpentChanged={value => {this.props.changeMemberSpentOnPayment(rowData.person.id, value)}}
                onPaidChanged={value => {this.props.changeMemberPaidOnPayment(rowData.person.id, value)}}
                showPaidForAllCheck={this.props.paidOne}
                onPaidForAllChecked={() => this.props.paidForAllChecked(rowData.person.id)}
                paidForAll={rowData.paidForAll}
                key={rowData.key}
                ref={this.refFor(rowData.key)}/>
        )
    }

    /**
     * Рендерим модальное окно для выбора участников счета.
     */
    renderChooseMembersModal = () => {
        // Добавляем к каждому участнику путешествия флаг selected - выбран ли он участником этого счета
        const members: IMemberItem[] = this.props.tripMembers.map((person: IPerson) => ({
                person,
                selected: _.some(this.props.members, (member: IMember) => member.person.id == person.id)
            })
        )
        const onChosenMembers = (personIdList) => {
            this.props.setMembersOfPayment(personIdList)
            this.setChooseMembersModalVisible(false)
        }
        return (
            <ModalWindow
                isOpened={this.state.chooseMembersModalVisible}
                closeModal={() => {this.setChooseMembersModalVisible(false)}}
            >
                <View>
                    <MembersListScene members={members} onFinish={onChosenMembers}/>
                </View>
            </ModalWindow>
        )
    }

    render() {
        const {loading, name, spentEqually, paidOne, totalRow, members} = this.props

        if (loading) {
            return <ActivityIndicator />
        }
        const data = [totalRow, ...members]
        return (
            <View style={commonStyles.flex} ref={'mainView'}>
                {this.renderNavigatorBar()}
                <TextInput
                    placeholder='Название'
                    onChangeText={text => {this.props.changePaymentName(text)}}
                    value={name}
                    style={commonStyles.wideInput}
                />
                <Switcher
                    label={'Потратили поровну'}
                    onValueChange={(value) => {
                        this.endEditingAllInputs()
                        this.props.spentEquallySwitched(value)
                        this.totalRow.spentFocus()
                    }}
                    value={spentEqually} />
                <Switcher
                    label={'Платил один'}
                    onValueChange={(value) => {
                        this.endEditingAllInputs()
                        this.props.paidOneSwitched(value)
                    }}
                    value={paidOne} />
                <RemovableListView
                    ref={'list'}
                    data={data}
                    renderRow={this.renderMemberRow}
                    removeRow={(personId) => this.props.removeMemberFromPayment(personId)} />
                <View style={[commonStyles.flex, commonStyles.bottomContainer]}>
                    <WideButton
                        text={'Изменить участников'}
                        onPress={() => {this.setChooseMembersModalVisible(true)}}/>
                </View>
                {this.renderChooseMembersModal()}
            </View>
        )
    }

    /**
     * Генератор ref по key для строк с участникам§и счета.
     * @param key
     */
    private refFor = (key) => `ref_${key}`
}

const mapStateToProps = (state: IStore, ownProps: IPaymentSceneProps): IStateProps => {
    const {tripId} = ownProps
    const trip = objectify.trip(state, state.trips.items[tripId])
    // Из списка всех счетов выберем редактируемый счет.
    const payment: IPayment = objectify.payment(state, state.payments.current)
    if (!payment) {
        return {loading: true}
    }
    // Добавим к каждому member поле key (этого требует элемент RemovableListView) и name
    const members: (IMember & IKey)[] = payment.members as (IMember & IKey)[]
    console.warn('mapStateToProps PaymentScene:', state)
    _.forEach(members, (member: IMember & IKey) => {
        member.key = member.person.id
    })
    const tripMembers: IPerson[] = trip.people
    // Вычислим строку Итого
    const totalPaid: number = _.reduce(payment.members, (sum, member) => sum + toNumber(member.paid), 0) // общее число потраченных денег
    const remainsToPay: number = totalPaid - payment.sum
    const totalRow: IMember & IKey = {person: {id: '', name: 'Общий счет'}, spent: payment.sum, paid: remainsToPay ? remainsToPay : undefined, key: 'totalRow'}

    const {id, name, spentEqually, paidOne, sum} = payment
    return {trip, tripMembers, paymentId: id, loading: false, name, spentEqually, paidOne, sum, members, totalRow}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({...paymentActions}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScene)

const styles = StyleSheet.create({
    totalRowStyle: {
        backgroundColor: '#FFCE73'
    },
    totalRowLabelStyle: {
        fontWeight: 'bold'
    },
    totalRowSpentStyle: {
        fontWeight: 'bold',
    },
    totalRowPaidStyle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: 'red'
    },
    chooseMembersModalStyle: {
        width: 300,
    }
})
