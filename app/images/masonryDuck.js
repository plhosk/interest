const masonryReducer = (state = { hasMore: false, newElements: [] }, action) => {
  switch (action.type) {
    case 'MASONRY_SET_HASMORE':
      return { ...state, hasMore: action.hasMore }
    case 'IMAGES_SINGLE_RECEIVED':
      return {
        ...state,
        newElements: state.newElements.includes(action.image.imageId) ?
          state.newElements : [action.image.imageId, ...state.newElements],
      }
    case 'IMAGES_LIST_RECEIVED':
      return { ...state, newElements: [] }
    // case 'MASONRY_SET_FORCE_UPDATE':
    //   return { ...state, forceUpdate: action.forceUpdate }
    default:
      return state
  }
}

export { masonryReducer } // eslint-disable-line import/prefer-default-export
