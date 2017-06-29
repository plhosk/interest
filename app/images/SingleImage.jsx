import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'
import Paper from 'material-ui/Paper'

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
    fontSize: '1em',
    textAlign: 'right',
  },
  dateDiv: {
    fontSize: '0.8em',
    textAlign: 'right',
    color: '#999',
  },
}

class SingleImage extends React.Component {

  state = {
    imgHeight: 250,
  }


  onLoad = () => {
    this.setState({ imgHeight: 'auto' }, () => {
      this.props.forcePack()
    })
  }

  render() {
    const { preview, imageId, url, caption, submitterId, submitterName, date,
  } = this.props
    return (
      <Paper style={styles.imageContainer}>
        <div style={styles.imgDiv}>
          <img
            style={{ ...styles.img, height: this.state.imgHeight }}
            alt={caption}
            src={url}
            onLoad={this.onLoad}
          />
        </div>
        <div style={styles.infoPanel}>
          <div style={styles.captionDiv}>
            {caption}
          </div>
          {!preview && (
            <div>
              <div style={styles.submitterDiv}>
                {`${submitterName} (#${submitterId})`}
              </div>
              <div style={styles.dateDiv}>
                <TimeAgo date={Date.parse(date)} />{` (#${imageId})`}
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
}

SingleImage.defaultProps = {
  preview: false,
  forcePack: () => {},
  imageId: 0,
  submitterId: 0,
  submitterName: '',
  date: '0',
}

export default SingleImage
