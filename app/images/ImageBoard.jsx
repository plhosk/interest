import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-infinite'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import FullscreenDialog from 'material-ui-fullscreen-dialog'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import Img from 'react-image'

import SingleImage from './SingleImage'

const styles = {
  header: {
    textAlign: 'center',
    margin: '0 auto',
    maxWidth: 1000,
    marginTop: 15,
    fontSize: '1.3em',
    border: '2px solid grey',
    borderRadius: 6,
    // backgroundColor: '#fbcd4b',
    backgroundColor: '#fdd475',
    padding: 6,
  },
  headerName: {
    fontWeight: 'bold',
    // color: '#303030',
    color: '#182652',
  },
  masonry: {
    margin: '10px 0',
  },
  zoomAppBar: {
    backgroundColor: '#a57c65',
  },
  zoomDiv: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faefd4',
    cursor: 'pointer',
  },
  zoomImg: {
    width: 'auto',
    height: 'auto',
    // borderRadius: 6,
    // maxWidth and maxHeight are set in the component definition below
  },
  zoomSpacer: {
    height: 64,
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
    zoomDialogOpen: false,
    zoomSrc: [],
    zoomCaption: '',
    deleteDialogOpen: false,
    deleteId: 0,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'IMAGES_LIST_REQUEST' })
  }

  // handleDeleteDialogOpen = () => {
  //   this.setState({ deleteDialogOpen: true })
  // }

  handleZoomDialogClose = () => {
    this.setState({ zoomDialogOpen: false, zoomSrc: [], zoomCaption: '' })
  }

  handleImageClick = (e) => {
    this.setState({
      zoomDialogOpen: true,
      zoomSrc: e.currentTarget.dataset.src,
      zoomCaption: e.currentTarget.dataset.caption,
    })
    e.preventDefault()
  }

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
            Images by <span style={styles.headerName}>{
              userInfo.allIds.includes(parseInt(match.params.userId, 10)) ?
              userInfo.byId[parseInt(match.params.userId, 10)].name :
              match.params.userId
            }</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <Link className="styledLink" to="/">Show&nbsp;All</Link>
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
              forcePack={this.masonryClass ? this.masonryClass.forcePack : () => {}}
              showDelete={
                user && user.userId === images.byId[imageId].submitterId
              }
              handleDelete={this.handleDelete}
              handleImageClick={this.handleImageClick}
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
              onClick={this.handleDeleteDialogClose}
            />,
            <RaisedButton
              label="Delete Image"
              primary
              keyboardFocused
              onClick={this.deleteConfirmed}
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

        <FullscreenDialog
          title={this.state.zoomCaption}
          modal={false}
          open={this.state.zoomDialogOpen}
          onRequestClose={this.handleZoomDialogClose}
          appBarStyle={styles.zoomAppBar}
        >
          <div
            style={styles.zoomDiv}
            onClick={this.handleZoomDialogClose}
            role="button"
            tabIndex={0}
          >
            <Img
              style={{ ...styles.zoomImg,
                maxWidth: window.innerWidth * 0.95,
                maxHeight: (window.innerHeight * 0.95) - 128 }}
              alt={this.state.zoomCaption}
              src={this.state.zoomSrc}
              loader={<div style={styles.progress}><CircularProgress size={80} /></div>}
            />
            <div style={styles.zoomSpacer}>&nbsp;</div>
          </div>
        </FullscreenDialog>
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
