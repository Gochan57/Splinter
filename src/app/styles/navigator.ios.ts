import {StyleSheet} from 'react-native'

// FIXME на эмуляторе IOS сверху есть полоска 20px с батареей и тд. Проверить, убирается ли она на девайсе,
// и если да, то избавиться от navigatorStyles
export const navigatorStyles = StyleSheet.create({
    scene: {
        marginTop: 20,
    },
})