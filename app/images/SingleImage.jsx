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
    // display: 'block',
    width: 230,
    borderRadius: 6,
  },
  infoPanel: {
    padding: 10,
  },
  captionDiv: {
    padding: 5,
    paddingTop: 0,
    // fontWeight: 'bold',
    fontSize: '1.2em',
    // fontFamily: 'Helvetica',
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

const SingleImage = ({ preview, imageId, url, caption, submitterId, submitterName, date }) => (
  <Paper style={styles.imageContainer}>
    <div style={styles.imgDiv}>
      <img
        style={styles.img}
        alt={caption}
        src={url}
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

SingleImage.propTypes = {
  preview: PropTypes.bool,
  imageId: PropTypes.number,
  url: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  submitterId: PropTypes.number,
  submitterName: PropTypes.string,
  date: PropTypes.string,
}

SingleImage.defaultProps = {
  preview: false,
  imageId: 0,
  submitterId: 0,
  submitterName: '',
  date: '0',
}

export default SingleImage
