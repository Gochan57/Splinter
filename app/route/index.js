import TripsScene from '../components/Trip/TripsScene'
import TripItem from '../components/Trip/TripItem'
import CreateNewTrip from '../components/Trip/CreateNewTrip'

export const scenes = {
    [TripsScene]: {
        title: 'Путешествия'
    },
    [TripItem]: {
        title: 'Счета'
    },
    [CreateNewTrip]: {
        title: 'Добавить путешествие'
    }
}

/**
 * @param navigator Объект навигатора.
 * @param component Компонент, который будет рендерится на странице с этим навигатором.
 * @param props Пропсы, которые передадутся в компонент.
 * @param title Заголовок в строке навигатора. Если не указан, то будет взят из scenes. Если нет там, то отобразится Notitle.
 * @param {Component} renderRightButton - Компонент правой кнопки, если заранее известен.
 * @param {boolean} rightBtnOK - Правая кнопка будет OK. Действие на кнопке нужно задать в поле route.rightBtnAction на компоненте,
 * который рендерится с этим навигатором (например в componentWillMount).
 */
export function goTo(params) {
    const {navigator, component, props, title, renderRightButton, rightBtnOK} = params
    navigator.push({
        component,
        title,
        passProps: props,
        renderRightButton,
        rightBtnOK,
    })
}