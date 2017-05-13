export const logAction = store => next => action => {
    console.info('store:', store.getState())
    console.info('action:', action)
    return next(action)
}