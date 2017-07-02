import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import CircularProgress from 'material-ui/CircularProgress'
import { Link } from 'react-router-dom'
import Img from 'react-image'

const styles = {
  imageContainer: {
    width: 240,
    padding: '5px 5px 0 5px',
    margin: 5,
    borderRadius: 11,
    background: 'white',
  },
  imgDiv: {},
  img: {
    width: 230,
    borderRadius: 6,
    cursor: 'pointer',
  },
  progress: {
    height: 250,
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    // border: '1px solid grey',
  },
  infoPanel: {
    padding: 10,
  },
  captionDiv: {
    padding: 5,
    paddingTop: 0,
    fontSize: '1.2em',
    textAlign: 'center',
  },
  submitterDiv: {
    fontSize: '0.8em',
    textAlign: 'right',
  },
  dateDiv: {
    fontSize: '0.8em',
    textAlign: 'right',
    color: '#999',
  },
  infoLower: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
  },
  deleteButtonDiv: {
    height: 36,
    zoom: 1,
    opacity: 0.8,
    marginLeft: -8, // move it left so it lines up with corner
    marginRight: 4,
    // border: '1px solid grey',
    alignSelf: 'flex-end',
  },
  deleteButton: {
    opacity: 0.7,
    alignSelf: 'flex-end',
    // display: 'none',
  },
}

class SingleImage extends React.Component {

  state = {
    imgHeight: 250,
  }

  handleImageLoad = () => {
    this.setState({ imgHeight: 'auto' }, () => {
      this.props.forcePack()
    })
  }

  render() {
    const {
      preview, imageId, url, caption, submitterId, submitterName,
      date, showDelete, handleDelete, handleImageClick,
    } = this.props
    return (
      <Paper style={styles.imageContainer}>
        <div style={styles.imgDiv}>
          <Img
            style={{ ...styles.img, height: this.state.imgHeight }}
            alt={caption}
            src={[url, '/imagenotfound.png']}
            data-src={[url, '/imagenotfound.png']}
            data-caption={caption}
            onLoad={this.handleImageLoad}
            loader={<div style={styles.progress}><CircularProgress size={80} /></div>}
            onClick={handleImageClick}
          />
        </div>
        <div style={styles.infoPanel}>
          <div style={styles.captionDiv}>
            {caption}
          </div>
          {!preview && (
            <div style={styles.infoLower}>
              <div style={styles.deleteButtonDiv}>
                {showDelete &&
                  <FloatingActionButton
                    mini
                    backgroundColor={'#fff'}
                    style={styles.deleteButton}
                    iconStyle={{ fill: 'grey' }}
                    data-id={imageId}
                    onClick={handleDelete}
                  >
                    { /*  */ }
                    <ActionDelete />
                  </FloatingActionButton>
                }
              </div>
              <div>
                <div style={styles.submitterDiv}>
                  <Link className="styledLink" to={`/users/${submitterId}`}>
                    {submitterName}
                  </Link>
                </div>
                <div style={styles.dateDiv}>
                  <TimeAgo date={Date.parse(date)} />{` (#${imageId})`}
                </div>
              </div>
            </div>
          )}
        </div>
      </Paper>
    )
  }

}


SingleImage.propTypes = {
  preview: PropTypes.bool,
  forcePack: PropTypes.func,
  imageId: PropTypes.number,
  url: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  submitterId: PropTypes.number,
  submitterName: PropTypes.string,
  date: PropTypes.string,
  showDelete: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleImageClick: PropTypes.func,
}

SingleImage.defaultProps = {
  preview: false,
  forcePack: () => {},
  imageId: 0,
  submitterId: 0,
  submitterName: '',
  date: '0',
  showDelete: false,
  handleDelete: () => {},
  handleImageClick: () => {},
}

export default connect()(SingleImage)
