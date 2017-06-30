const masonryReducer = (state = {
  hasMore: false,
  newElements: [],
  deletedElements: [],
}, action) => {
  switch (action.type) {
    case 'MASONRY_SET_HASMORE':
      return { ...state, hasMore: action.hasMore }
    case 'MASONRY_DELETE_IMAGE':
      return { ...state, deletedElements: [...state.deletedElements, action.imageId] }
    case 'IMAGES_SINGLE_RECEIVED':
      return {
        ...state,
        newElements: state.newElements.includes(action.image.imageId) ?
          state.newElements : [action.image.imageId, ...state.newElements],
      }
    case 'IMAGES_LIST_RECEIVED':
      return { ...state, newElements: [], deletedElements: [] }
    // case 'MASONRY_SET_FORCE_UPDATE':
    //   return { ...state, forceUpdate: action.forceUpdate }
    default:
      return state
  }
}

export { masonryReducer } // eslint-disable-line import/prefer-default-export
