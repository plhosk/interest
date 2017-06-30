import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-infinite'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'

import SingleImage from './SingleImage'

const styles = {
  header: {
    textAlign: 'center',
    margin: '0 auto',
    width: 500,
    marginTop: 15,
    fontSize: '1.3em',
    border: '1px solid grey',
    borderRadius: 6,
    backgroundColor: 'white',
    padding: 4,
  },
  headerName: {
    fontWeight: 'bold',
    color: '#5d535e',
  },
  masonry: {
    margin: '10px 0',
  },
}

// How many images to load in a single chunk
const masonryBatchSize = 10

const masonrySizes = [
  { columns: 1, gutter: 10 },
  { mq: '515px', columns: 2, gutter: 10 },
  { mq: '765px', columns: 3, gutter: 10 },
  { mq: '1015px', columns: 4, gutter: 10 },
  { mq: '1265px', columns: 5, gutter: 10 },
  { mq: '1515px', columns: 6, gutter: 10 },
  { mq: '1765px', columns: 7, gutter: 10 },
  { mq: '2015px', columns: 8, gutter: 10 },
  { mq: '2265px', columns: 9, gutter: 10 },
  { mq: '2515px', columns: 10, gutter: 10 },
  { mq: '2765px', columns: 11, gutter: 10 },
  { mq: '3015px', columns: 12, gutter: 10 },
  { mq: '3265px', columns: 13, gutter: 10 },
  { mq: '3515px', columns: 14, gutter: 10 },
  { mq: '3765px', columns: 15, gutter: 10 },
  { mq: '4015px', columns: 16, gutter: 10 },
  { mq: '4265px', columns: 17, gutter: 10 },
]

class ImageBoard extends React.Component {

  state = {
    elements: [],
    deleteDialogOpen: false,
    deleteId: 0,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'IMAGES_LIST_REQUEST' })
  }

  // handleDeleteDialogOpen = () => {
  //   this.setState({ deleteDialogOpen: true })
  // }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false, deleteId: 0 })
  }

  handleDelete = (e) => {
    this.setState({ deleteDialogOpen: true, deleteId: e.currentTarget.dataset.id })
    e.preventDefault()
  }

  deleteConfirmed = () => {
    this.props.dispatch({ type: 'IMAGES_DELETE_REQUEST', imageId: this.state.deleteId })
    this.handleDeleteDialogClose()
  }

  /**
   * loadMore is a function for Masonry to support infinite scrolling.
   * It takes a certain number of imageIds from state.images.allIds and adds them
   * to this.state.elements.
   * It's called when the user scrolls down and we need to load more elements,
   * and only if state.masonry.hasMore is true. (it's set to false when all images
   * in state.images.allIds have been inserted).
   * This function relies on the array indices in state.images.allIds being consistent,
   * so extra adjustments have to be made when an image is added or removed after
   * the Masonry has been initialized.
   */
  loadMore = () => {
    const { newElements } = this.props.masonry

    // let updatedElements = [...masonry.newElements, ...this.state.elements]
    // updatedElements = updatedElements.filter(el => (
    //   !masonry.deletedElements.includes(el)
    // ))

    // const fullImageCount = this.state.elements.length + newElements.length

    if (this.state.elements.length + newElements.length === this.props.images.allIds.length) {
      this.props.dispatch({ type: 'MASONRY_SET_HASMORE', hasMore: false })
    } else {
      this.setState(prevState => ({
        elements: prevState.elements.concat(this.props.images.allIds.slice(
          prevState.elements.length + newElements.length,
          prevState.elements.length + newElements.length + masonryBatchSize,
        )),
      }))
    }
  }

  render() {
    const { masonry, user, userInfo, images, match } = this.props

    // Wait for both userInfo and images to be populated before rendering
    if (userInfo.allIds.length === 0 || images.allIds.length === 0) {
      return null
    }

    /**
     * When adding or deleting a single image after the Masonry has already rendered,
     * just updating state.images is not enough.
     *
     * this.state.elements is augmented by state.masonry.newElements,
     * and any imageIds that are in state.masonry.deletedElements are filtered out.
     */
    let updatedElements = [...masonry.newElements, ...this.state.elements]
    updatedElements = updatedElements.filter(el => (
      !masonry.deletedElements.includes(el)
    ))

    if (match.params.userId) {
      updatedElements = updatedElements.filter(el => (
        parseInt(match.params.userId, 10) === images.byId[el].submitterId
      ))
    }

    return (
      <div>
        {match.params.userId && (
          <div style={styles.header}>
            Showing images sbmitted by <span style={styles.headerName}>{
              userInfo.allIds.includes(parseInt(match.params.userId, 10)) ?
              userInfo.byId[parseInt(match.params.userId, 10)].name :
              match.params.userId
            }</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/">Show All</Link>
          </div>
        )}
        <Masonry
          ref={(component) => { this.masonryClass = component }}
          pack
          style={styles.masonry}
          hasMore={masonry.hasMore}
          loadMore={this.loadMore}
          sizes={masonrySizes}
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
              showDelete={
                user && user.userId === images.byId[imageId].submitterId
              }
              handleDelete={this.handleDelete}
            />
          ))}
        </Masonry>

        <Dialog
          title="Confirm Delete"
          modal={false}
          open={this.state.deleteDialogOpen}
          onRequestClose={this.handleDeleteDialogClose}
          actions={[
            <RaisedButton
              label="Cancel"
              onTouchTap={this.handleDeleteDialogClose}
            />,
            <RaisedButton
              label="Delete Image"
              primary
              keyboardFocused
              onTouchTap={this.deleteConfirmed}
            />,
          ]}
        >
          {images.byId[this.state.deleteId] &&
            <div>
              <p>Are you sure you want to delete this image?</p>
              <p>{`Caption: ${images.byId[this.state.deleteId].caption}`}</p>
              <p>Added:&nbsp;
                <TimeAgo date={Date.parse(images.byId[this.state.deleteId].date)} />
              </p>
            </div>
          }
        </Dialog>
      </div>
    )
  }
}

ImageBoard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  masonry: PropTypes.shape({
    hasMore: PropTypes.bool,
    newElements: PropTypes.array,
  }).isRequired,
  user: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
  }),
  userInfo: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
  images: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
}

ImageBoard.defaultProps = {
  user: undefined,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  masonry: state.masonry,
  userInfo: state.userInfo,
  images: state.images,
})


export default connect(mapStateToProps)(ImageBoard)
