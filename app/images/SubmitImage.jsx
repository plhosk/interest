import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import ImageImage from 'material-ui/svg-icons/image/image'
import ImageAddToPhotos from 'material-ui/svg-icons/image/add-to-photos'
// import FlatButton from 'material-ui/FlatButton'

const styles = {
  header: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    height: 50,
    userSelect: 'none',
  },
  title: {
    flex: '2 1 auto',
    textAlign: 'center',
    display: 'inline',
    fontWeight: 'bold',
    fontSize: '1.1em',
    paddingTop: 8,
    // marginTop: 4,
    marginTop: -6,
    marginLeft: -6,
    marginRight: -8,
    marginBottom: 16,
    // margin: '-10px -10px 5px -10px',
  },
  openCloseButton: {
    display: 'block',
    textAlign: 'right',
    position: 'relative',
    left: 0,
    top: -22,
  },
  openCloseButtonIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#fbcd4b',
  },
  openCloseButtonButton: {
    width: 50,
    height: 50,
    // padding: 24,
  },
  // outerContainer: {
  //   // textAlign: 'right',
  //   margin: '0 auto',
  //   padding: 0,
  //   maxWidth: 500,
  //   overflow: 'hidden',
  //   border: '1px solid #aaa',
  //   display: 'flex',
  //   flexFlow: 'row nowrap',
  //   justifyContent: 'flex-end',
  // },
  outermostDiv: {
    textAlign: 'left',
    maxWidth: 500,
    // height: 50,
    margin: '0 auto',
    // width: 48,
    // height: 48,
    // width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #aaa',
  },
  form: {
    margin: 10,
  },
  formElementDiv: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    // border: '1px solid grey',
  },
  labelDiv: {
  },
  textFieldDiv: {
  },
  label: {
    fontWeight: 'bold',
  },
  textField: {
    width: 300,
  },
  buttonsDiv: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    margin: '10px 0',
  },
  buttonClear: {
    margin: 10,
    flex: '0 1 auto',
  },
  buttonPreview: {
    margin: 10,
    flex: '1 1 auto',
  },
  buttonSubmit: {
    margin: 10,
    flex: '4 1 auto',
  },
}

class SubmitImage extends React.Component {

  state = {
    panelOpen: false,
    url: '',
    caption: '',
    urlErrorText: '',
    captionErrorText: '',
  }

  togglePanelHeight = () => {
    this.setState({ panelOpen: !this.state.panelOpen })
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
    event.preventDefault()
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
  }

  render() {
    if (!this.props.user) {
      // not logged in
      return null
    }

    return (
      <Paper
        style={{
          ...styles.outermostDiv,
          height: this.state.panelOpen ? 'auto' : 50,
        }}
      >
        <div style={styles.header}>
          <div
            style={styles.title}
            onClick={this.togglePanelHeight}
            role="button"
            tabIndex="0"
          >
            Submit New Image
          </div>
          <div style={styles.openCloseButton}>
            <IconButton
              iconStyle={styles.openCloseButtonIcon}
              style={styles.openCloseButtonButton}
              onClick={this.togglePanelHeight}
            >
              {this.state.panelOpen ?
                <HardwareKeyboardArrowUp /> :
                <HardwareKeyboardArrowDown />
              }
            </IconButton>
          </div>
        </div>
        <form style={styles.form} onSubmit={this.handleSubmit}>
          <div style={styles.formElementDiv}>
            <div style={styles.labelDiv}>
              <label style={styles.label} htmlFor="url">Image URL:</label>
            </div>
            <div style={styles.textFieldDiv}>
              <TextField
                style={styles.textField}
                id="url"
                type="text"
                spellCheck="false"
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
              style={styles.buttonClear}
              backgroundColor="#faefd4"
              label="Clear"
              onClick={this.handleClear}
            />
            <RaisedButton
              style={styles.buttonPreview}
              backgroundColor="#d6c6b9"
              icon={<ImageImage color={'#faefd4'} />}
              label="Preview"
              labelPosition="after"
              onClick={this.handlePreview}
            />
            <RaisedButton
              style={styles.buttonSubmit}
              backgroundColor="#97b8c2"
              type="submit"
              label="Add Image"
              labelPosition="after"
              icon={<ImageAddToPhotos color={'#faefd4'} />}
            />
          </div>
        </form>
      </Paper>
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
