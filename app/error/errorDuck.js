const errorReducer = (state = '', action) => {
  switch (action.type) {
    case 'ERROR_MESSAGE_SHOW':
      return action.error
    case 'ERROR_MESSAGE_HIDE':
      return ''
    default:
      return state
  }
}

export { errorReducer } // eslint-disable-line import/prefer-default-export
