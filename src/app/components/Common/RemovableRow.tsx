import React, {
    Component,
} from 'react'
import {
    View,
    ViewStyle
} from 'react-native'

/**
 * removeRow Функция, убирающая одну строку из данных.
 * maxSwipeDistance Расстояние, на которое нужно свайпнуть, чтобы произошел removeRow (default = 200).
 */
interface IProps {
    removeRow: () => void,
    maxSwipeDistance?: number,
}

/**
 * isSwiping Флаг, что происходит свайп.
 * marginLeft Отклонение элемента из-за свайпа (при свайпе налево имеет отрицательные значения).
 * isDeleting Отклонение элемента достигло значения maxSwipeDistance, элемент становится прозрачным.
 * opacity По мере приближения отклонения к значению maxSwipeDistance элемент постепенно становится более прозрачным.
 */
interface IState {
    isSwiping: boolean,
    marginLeft: number,
    isDeleting: boolean,
    opacity: number,
}

/**
 * Строка в RemovableListView, при свайпе в горизонтальном направлении строка удаляется.
 */
export default class RemovableRow extends Component<IProps, IState> {
    static defaultProps: Partial<IProps> = {
        maxSwipeDistance: 200,
    }

    // Хак против ts. Без переопределения refs с any нет возможности вызвать measure.
    refs: {[key: string]: any}

    /**
     * Начальная позиция элемента. Задается при старте свайпа.
     */
    private startPosition = {
        pageX: 0,
        pageY: 0,
    }

    private width: number
    private height: number

    constructor (props) {
        super(props)
        this.state = {
            isSwiping: false,
            marginLeft: 0,
            isDeleting: false,
            opacity: 1,
        }
    }

    /**
     * Вызовется при начале свайпа.
     */
    startSwiping = (e) => {
        // Сохраняем начальные позиции элемента, чтобы вернуться к ним, если свайп закончится без удаления элемента.
        this.startPosition.pageX = e.nativeEvent.pageX
        // Сохраняем начальную ширину элемента, чтобы она оставалась постоянной в течение свайпа.
        this.refs.row.measure((ox, oy, width, height, px, py) => {
            this.width = width
            this.height = height
        })
        this.setState({
            isSwiping: true,
        })
    }

    /**
     * Вызовется по окончании свайпа.
     */
    finishSwiping = (e) => {
        if (this.state.isDeleting) {
            this.props.removeRow()
        }
        else {
            this.startPosition.pageX = 0
            this.startPosition.pageY = 0
            this.setState({
                isSwiping: false,
                marginLeft: 0,
                isDeleting: false,
                opacity: 1,
            })
        }
    }

    /**
     * Вызывается во время свайпа.
     */
    move = (e) => {
        const {maxSwipeDistance} = this.props
        const marginLeft = e.nativeEvent.pageX - this.startPosition.pageX
        // если отклонение превышает maxSwipeDistance, элемент будет удален
        const isDeleting = (Math.abs(marginLeft) > maxSwipeDistance)
        // прозрачность элемента равномерно меняется по мере приближения к maxSwipeDistance
        const opacity = 1 - Math.min(Math.abs(marginLeft) / maxSwipeDistance, 1)
        this.setState({marginLeft, isDeleting, opacity})
    }

    /**
     * Пустой элемент такой же высоты, как и строка.
     * Рисуется вместо строки, если свайпнули больше, чем на maxSwipeDistance.
     */
    emptyRow = () => (
        <View style={{width: this.width, height: this.height}}/>
    )

    render() {
        const {marginLeft, opacity} = this.state
        const swipeProps = {
            onStartShouldSetResponder: (e) => true,
            onMoveShouldSetResponder: (e) => true,
            onResponderGrant: this.startSwiping,
            onResponderReject: this.finishSwiping,
            onResponderMove: this.move,
            onResponderRelease: this.finishSwiping,
            onResponderTerminationRequest: (e) => true,
            onResponderTerminate: this.finishSwiping,
        }
        const style: ViewStyle = {marginLeft, opacity}
        if (this.width) {
            style.width = this.width
        }
        const content = this.props.children
        return (
            <View ref='row' {...swipeProps} style={style}>
                {content}
            </View>
        )
    }
}