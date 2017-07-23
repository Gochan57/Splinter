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
import {filter, find, forEach, pickBy, reduce, some} from 'lodash'

import {
    paymentActions,
} from 'app/action/payments'
import {toArrayWithKeys, toNumber, toNumberNullable, round} from 'app/utils/utils'
import {TEMPORARY_ID} from 'app/constants'
import appStyles from 'app/styles'

import SNavigatorBar, {IconType, button} from 'app/components/Common/Navigator/SNavigatorBar'
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
import {IPerson} from 'app/models/trips'
import {
    IKey,
    IStore
} from 'app/models/common'

const commonStyles = appStyles.commonStyles

const TOTAL_ROW_REF = 'totalRow'

/**
 * navigator Навигатор для перехода на другие экраны.
 * tripId Идентификатор путешествия.
 */
interface IProps {
    navigator: NavigatorStatic,
    tripId: string,
}

/**
 * Строка Итого.
 */
interface ITotalRow {
    name: string,
    spent: number,
    paid: number,
    key: string
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
    tripMembers?: IPerson[],
    paymentId?: string,
    loading?: boolean,
    name?: string,
    spentEqually?: boolean,
    paidOne?: boolean,
    sum?: number,
    members?: (IMember & IKey)[],
    totalRow?: ITotalRow,
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
class PaymentScene extends Component<IProps & IStateProps & IDispatchProps, IState> {
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

    private totalRow: PaymentMember = null

    /**
     * Генератор ref по key для строк с участниками счета.
     * @param key
     */
    refFor = (key) => `ref_${key}`

    /**
     * Снять фокус со всех инпутов.
     */
    endEditingAllInputs = () => {
        const {members} = this.props
        this.totalRow.blur()
        forEach(members, member => {
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
        const {tripId, paymentId} = this.props
        if (paymentId) {
            this.props.startUpdatingPayment(paymentId)
        }
        else {
            this.props.startCreatingNewPayment(tripId)
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
            <SNavigatorBar
                LeftButton={leftButton}
                Title={title}
                RightButton={rightButton}
            />
        )
    }

    renderMemberRow = (rowData) => {
        if (rowData.key === TOTAL_ROW_REF) {
            // Верхняя строка с общим счетом
            return (
                <PaymentMember
                    name={rowData.name}
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
                name={rowData.name}
                spent={toNumberNullable(rowData.spent)}
                paid={toNumberNullable(rowData.paid)}
                spentEditable={!this.props.spentEqually}
                paidEditable={!this.props.paidOne}
                onSpentChanged={value => {this.props.changeMemberSpentOnPayment(rowData.personId, value)}}
                onPaidChanged={value => {this.props.changeMemberPaidOnPayment(rowData.personId, value)}}
                showPaidForAllCheck={this.props.paidOne}
                onPaidForAllChecked={() => this.props.paidForAllChecked(rowData.personId)}
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
        const members: IMemberItem[] = this.props.tripMembers.map(member => ({
                ...member,
                selected: some(this.props.members, {personId: member.personId})
            })
        )
        const onChosenMembers = (personIdList) => {
            this.props.setMembersOfPayment(personIdList)
            this.setChooseMembersModalVisible(false)
        }
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.chooseMembersModalVisible}>
                <TouchableHighlight
                    style={[commonStyles.flex, commonStyles.centerContainer]}
                    onPress={() => {this.setChooseMembersModalVisible(false)}}>
                    <View style={styles.chooseMembersModalStyle}>
                        <MembersListScene members={members} onFinish={onChosenMembers}/>
                    </View>
                </TouchableHighlight>
            </Modal>
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
}

const mapStateToProps = (state: IStore, ownProps: IProps): IStateProps => {
    const {tripId} = ownProps
    // Из списка всех счетов выберем редактируемый счет.
    const payment: IPayment = state.payments[TEMPORARY_ID]
    if (!payment) {
        return {loading: true}
    }
    // Все участники путешествия
    const people = state.trips[tripId].people
    // Добавим к каждому member поле key (этого требует элемент RemovableListView) и name
    const members: (IMember & IKey)[] = payment.members as (IMember & IKey)[]
    members.forEach(member => {
        member.key = member.personId
        member.name = people[member.personId].name
    })
    const tripMembers = toArrayWithKeys(people, 'personId')
    // Вычислим строку Итого
    const totalPaid = reduce(payment.members, (sum, member) => sum + toNumber(member.paid), 0) // общее число потраченных денег
    const remainsToPay = totalPaid - payment.sum
    const totalRow = {name: 'Общий счет', spent: payment.sum, paid: remainsToPay ? remainsToPay : undefined, key: TOTAL_ROW_REF}

    const {paymentId, name, spentEqually, paidOne, sum} = payment
    return {tripMembers, paymentId, loading: false, name, spentEqually, paidOne, sum, members, totalRow}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(paymentActions, dispatch)
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
