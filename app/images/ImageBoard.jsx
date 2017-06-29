import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-infinite'

import SingleImage from './SingleImage'

const styles = {
  masonry: {
    margin: '10px 0',
  },
}

class ImageBoard extends React.Component {

  state = {
    elements: [],
  }

  componentDidMount() {
    this.props.dispatch({ type: 'IMAGES_LIST_REQUEST' })
  }

  loadMore = () => {
    const { newElements } = this.props.masonry
    if (this.state.elements.length + newElements.length === this.props.images.allIds.length) {
      this.props.dispatch({ type: 'MASONRY_SET_HASMORE', hasMore: false })
    } else {
      this.setState(prevState => ({
        elements: prevState.elements.concat(this.props.images.allIds.slice(
          prevState.elements.length + newElements.length,
          prevState.elements.length + newElements.length + 10,
        )),
      }))
    }
  }

  render() {
    const { masonry, userInfo, images } = this.props

    // Wait for both userInfo and images to be populated before rendering
    if (userInfo.allIds.length === 0 || images.allIds.length === 0) {
      return null
    }

    const updatedElements = [...masonry.newElements, ...this.state.elements]

    return (
      <Masonry
        ref={(component) => { this.masonryClass = component }}
        style={styles.masonry}
        hasMore={masonry.hasMore}
        loadMore={this.loadMore}
        sizes={[
          { columns: 1, gutter: 10 },
          { mq: '515px', columns: 2, gutter: 10 },
          { mq: '765px', columns: 3, gutter: 10 },
          { mq: '1015px', columns: 4, gutter: 10 },
          { mq: '1265px', columns: 5, gutter: 10 },
          { mq: '1515px', columns: 6, gutter: 10 },
          { mq: '1765px', columns: 7, gutter: 10 },
          { mq: '2015px', columns: 8, gutter: 10 },
          { mq: '2265px', columns: 9, gutter: 10 },
        ]}
      >
        {updatedElements.map(imageId => (
          <SingleImage
            key={imageId + images.byId[imageId].date}
            imageId={imageId}
            url={images.byId[imageId].url}
            caption={images.byId[imageId].caption}
            submitterId={images.byId[imageId].submitterId}
            submitterName={userInfo.byId[images.byId[imageId].submitterId].name}
            date={images.byId[imageId].date}
            forcePack={this.masonryClass.forcePack}
          />
        ))}
      </Masonry>
    )
  }
}

ImageBoard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  masonry: PropTypes.shape({
    hasMore: PropTypes.bool,
    newElements: PropTypes.array,
  }).isRequired,
  userInfo: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
  images: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
}

const mapStateToProps = state => ({
  // user: state.auth.user,
  masonry: state.masonry,
  userInfo: state.userInfo,
  images: state.images,
})


export default connect(mapStateToProps)(ImageBoard)
