import TripsScene from '../components/Trip/TripsScene'
import TripItem from '../components/Trip/TripItem'

const scenes = {
    [TripsScene]: {
        title: 'Путешествия'
    },
    [TripItem]: {
        title: 'Счета'
    }
}

/**
 * @param navigator
 * @param component
 * @param ? props
 * @param {?string }title
 * @param {?() = > void} onSuccess - Will be called by pressing button "Done" at the page, and then go back
 * @param (?() = > void) rightBtnAction - Will be called by pressing button "Done"
 * @param (?() = > void) renderRightButton - Right button on navigation menu (maybe several buttons)
 */
export function goTo(params) {
    const {navigator, component, props, title, rightBtnAction, renderRightButton} = params
    const _title = title || scenes[component] || 'Add title to routes'
    navigator.push({
        component,
        title: _title,
        passProps: props,
        rightBtnAction,
        renderRightButton
    })
}