import React, { Component, PropTypes } from 'react'
import {View} from 'react-native'

/**
 * Строка в RemovableListView, при свайпе в горизонтальном направлении строка удаляется.
 */
export default class RemovableRow extends Component {
    static defaultProps = {
        maxSwipeDistance: 200,
    }

    /**
     * removeRow Функция, убирающая одну строку из данных.
     * maxSwipeDistance Расстояние, на которое нужно свайпнуть, чтобы произошел removeRow (default = 200).
     */
    static propTypes = {
        removeRow: PropTypes.func.isRequired,
        maxSwipeDistance: PropTypes.number,
    }

    /**
     * isSwiping Флаг, что происходит свайп.
     * marginLeft Отклонение элемента из-за свайпа (при свайпе налево имеет отрицательные значения).
     * isDeleting Отклонение элемента достигло значения maxSwipeDistance, элемент становится прозрачным.
     * opacity По мере приближения отклонения к значению maxSwipeDistance элемент постепенно становится более прозрачным.
     */
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
     * Начальная позиция элемента. Задается при старте свайпа.
     */
    startPosition = {
        pageX: 0,
        width: null,
        height: null,
    }

    /**
     * Вызовется при начале свайпа.
     */
    startSwiping = (e) => {
        // Сохраняем начальные позиции элемента, чтобы вернуться к ним, если свайп закончится без удаления элемента.
        this.startPosition.pageX = e.nativeEvent.pageX
        // Сохраняем начальную ширину элемента, чтобы она оставалась постоянной в течение свайпа.
        this.refs.row.measure((ox,oy,width,height,px,py) => {
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
        const {removeRow, maxSwipeDistance} = this.props
        const marginLeft = e.nativeEvent.pageX - this.startPosition.pageX
        // если отклонение превышает maxSwipeDistance, элемент будет удален
        const isDeleting = (Math.abs(marginLeft) > maxSwipeDistance)
        // прозрачность элемента равномерно меняется по мере приближения к maxSwipeDistance
        const opacity = 1 - Math.min(Math.abs(marginLeft)/maxSwipeDistance, 1)
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
        const style = {marginLeft, opacity}
        if (this.width) {
            style.width = this.width
        }
        const content = this.props.children
        //const content = isDeleting ? this.emptyRow() : this.props.children
        //if (isDeleting) {
        //    style.color = 'white'
        //}
        return (
            <View ref="row" {...swipeProps} style={style}>
                {content}
            </View>
        )
    }
}