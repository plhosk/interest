import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
// import FlatButton from 'material-ui/FlatButton'

const styles = {
  outermostDiv: {
    maxWidth: 400,
  },
  title: {
    fontWeight: 'bold',
    margin: '1em 0',
  },
  formElementDiv: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  labelDiv: {
  },
  textFieldDiv: {
  },
  label: {
    fontWeight: 'bold',
  },
  textField: {},
  buttonsDiv: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
  },
  button: {
    margin: 10,
  },
}

class SubmitImage extends React.Component {

  state = {
    url: '',
    caption: '',
    urlErrorText: '',
    captionErrorText: '',
  }

  handleChangeUrl = (event) => {
    this.setState({ url: event.target.value })
  }
  handleChangeCaption = (event) => {
    this.setState({ caption: event.target.value })
  }
  handleClear = () => {
    this.setState({
      url: '',
      caption: '',
      urlErrorText: '',
      captionErrorText: '',
    })
  }
  handleSubmit = (event) => {
    let doNotSubmit = false
    if (this.state.url === '') {
      this.setState({ urlErrorText: 'This field is required' })
      doNotSubmit = true
    } else {
      this.setState({ urlErrorText: '' })
    }
    if (this.state.caption === '') {
      this.setState({ captionErrorText: 'This field is required' })
      doNotSubmit = true
    } else {
      this.setState({ captionErrorText: '' })
    }
    if (doNotSubmit) {
      return
    }
    this.props.dispatch({
      type: 'IMAGES_ADD_REQUEST',
      url: this.state.url,
      caption: this.state.caption,
    })
    event.preventDefault()
  }

  render() {
    if (!this.props.user) {
      // not logged in
      return null
    }

    return (
      <div style={styles.outermostDiv}>
        <div style={styles.title}>Submit Image Form</div>
        <form onSubmit={this.handleSubmit}>

          <div style={styles.formElementDiv}>
            <div style={styles.labelDiv}>
              <label style={styles.label} htmlFor="url">Image URL:</label>
            </div>
            <div style={styles.textFieldDiv}>
              <TextField
                style={styles.textField}
                id="url"
                type="text"
                hintText="Enter Image URL"
                errorText={this.state.urlErrorText}
                value={this.state.url}
                onChange={this.handleChangeUrl}
              />
            </div>
          </div>

          <div style={styles.formElementDiv}>
            <div style={styles.labelDiv}>
              <label style={styles.label} htmlFor="caption">Image Caption:</label>
            </div>
            <div style={styles.textFieldDiv}>
              <TextField
                style={styles.textField}
                id="caption"
                type="text"
                hintText="Enter Caption"
                errorText={this.state.captionErrorText}
                value={this.state.caption}
                onChange={this.handleChangeCaption}
              />
            </div>
          </div>

          <div style={styles.buttonsDiv}>
            <RaisedButton
              style={styles.button}
              backgroundColor="green"
              label="Clear"
              onClick={this.handleClear}
            />
            <RaisedButton
              style={styles.button}
              type="submit"
              label="Add Image"
            />
          </div>

        </form>
      </div>
    )
  }
}

SubmitImage.propTypes = {
  user: PropTypes.shape({}),
  dispatch: PropTypes.func.isRequired,
}

SubmitImage.defaultProps = {
  user: undefined,
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(SubmitImage)
