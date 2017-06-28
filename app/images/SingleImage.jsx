import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'
import Paper from 'material-ui/Paper'

const styles = {
  imageContainer: {
    width: 240,
    padding: 20,
    margin: 5,
    borderRadius: 12,
    background: 'white',
  },
  imgDiv: {},
  img: {
    width: 200,
    borderRadius: 6,
  },
  captionDiv: {
    margin: '10px 5px',
    // fontWeight: 'bold',
    fontSize: '1.3em',
    fontFamily: 'Helvetica',
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

const SingleImage = ({ imageId, url, caption, submitterId, submitterName, date }) => (
  <Paper style={styles.imageContainer}>
    <div style={styles.imgDiv}>
      <img
        style={styles.img}
        alt={caption}
        src={url}
      />
    </div>
    <div style={styles.captionDiv}>
      {`Image #${imageId}: ${caption}`}
    </div>
    <div style={styles.submitterDiv}>
      {`${submitterName} (#${submitterId})`}
    </div>
    <div style={styles.dateDiv}>
      <TimeAgo date={Date.parse(date)} />
    </div>
  </Paper>
)

SingleImage.propTypes = {
  imageId: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  submitterId: PropTypes.number.isRequired,
  submitterName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
}

export default SingleImage
