import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'

const styles = {
  outermostDiv: {},
  flexContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imageContainer: {},
  imgDiv: {},
  img: {},
  captionDiv: {},
  submitterDiv: {},
}

class ImageBoard extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'IMAGES_LIST_REQUEST' })
  }

  render() {
    const { userInfo, images } = this.props

    return (
      <div style={styles.outermostDiv}>
        <div style={styles.flexContainer}>
          {images.allIds.map((imageId) => {
            if (images.byId[imageId].deleted) {
              return null
            }
            return (
              <div key={imageId} style={styles.imageContainer}>
                <div style={styles.imgDiv}>
                  <img
                    style={styles.img}
                    alt={images.byId[imageId].caption}
                    src={images.byId[imageId].url}
                  />
                </div>
                <div style={styles.captionDiv}>
                  {images.byId[imageId].caption}
                </div>
                <div style={styles.submitterDiv}>
                  {userInfo.byId[images.byId[imageId].submitterId].name}
                </div>
                <div style={styles.dateDiv}>
                  <TimeAgo date={Date.parse(images.byId[imageId].date)} />
                </div>
              </div>
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
