import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SingleImage from './SingleImage'

const styles = {
  outermostDiv: {},
  flexContainer: {
    margin: '10px 0',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}

class ImageBoard extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'IMAGES_LIST_REQUEST' })
  }

  render() {
    const { userInfo, images } = this.props

    // Wait for both userInfo and images to be populated before rendering
    if (userInfo.allIds.length === 0 || images.allIds.length === 0) {
      return null
    }

    return (
      <div style={styles.outermostDiv}>
        <div style={styles.flexContainer}>
          {images.allIds.map((imageId) => {
            if (images.byId[imageId].deleted) {
              return null
            }
            return (
              <SingleImage
                key={imageId}
                imageId={imageId}
                url={images.byId[imageId].url}
                caption={images.byId[imageId].caption}
                submitterId={images.byId[imageId].submitterId}
                submitterName={userInfo.byId[images.byId[imageId].submitterId].name}
                date={images.byId[imageId].date}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

ImageBoard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // user: PropTypes.shape({
  //   userId: PropTypes.number,
  //   name: PropTypes.string,
  //   city: PropTypes.string,
  //   country: PropTypes.string,
  // }),
  userInfo: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
  images: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
}

// ImageBoard.defaultProps = {
//   user: undefined,
// }

const mapStateToProps = state => ({
  // user: state.auth.user,
  userInfo: state.userInfo,
  images: state.images,
})


export default connect(mapStateToProps)(ImageBoard)
