import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import ImageImage from 'material-ui/svg-icons/image/image'
import ActionAccountBox from 'material-ui/svg-icons/action/account-box'
import ActionPermIdentity from 'material-ui/svg-icons/action/perm-identity'
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new'
import SocialPerson from 'material-ui/svg-icons/social/person'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'

const styles = {
  appBar: {
    backgroundColor: '#755248',
  },
  home: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  title: {
    cursor: 'pointer',
  },
  rightSpan: {
    display: 'flex',
    flexFlow: 'row wrap',

  },
  button: {
    backgroundColor: 'transparent',
    color: 'white',
    paddingTop: 6,
    marginBottom: 8,
    textAlign: 'left',
    minWidth: 160,
  },
  buttonText: {
    // fontSize: '1.1em',
  },
  profileForm: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  textFieldContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    lineHeight: '3em',
    justifyContent: 'center',
  },
  textFieldLabel: {
    minWidth: 100,
    margin: '0 10px',
    textAlign: 'right',
  },
  textField: {
    maxWidth: 200,
    marginLeft: 5,
    marginRight: 5,
  },
}

class TopBar extends React.Component {

  state = {
    openProfileDialog: false,
    profileName: undefined,
    // profileCity: undefined,
    // profileCountry: undefined,
  }

  componentDidMount() {
    // Refresh user state when loading component (including after login redirect)
    this.props.dispatch({ type: 'AUTH_USER_OBJECT_REQUEST' })
    // Populate userInfo to allow lookup of other user names and metadata
    this.props.dispatch({ type: 'USERINFO_REQUEST' })
  }

  handleReset = () => {
    this.setState({
      profileName: this.props.user.name,
      // profileCity: this.props.user.city,
      // profileCountry: this.props.user.country,
    })
  }

  handleOpenProfileDialog = () => {
    this.handleReset()
    this.setState({ openProfileDialog: true })
  }

  handleCloseProfileDialog = () => {
    this.handleReset()
    this.setState({ openProfileDialog: false })
  }

  handleChangeProfileName = (event) => {
    this.setState({ profileName: event.target.value })
  }
  // handleChangeProfileCity = (event) => {
  //   this.setState({ profileCity: event.target.value })
  // }
  // handleChangeProfileCountry = (event) => {
  //   this.setState({ profileCountry: event.target.value })
  // }

  handleProfileSubmit = (event) => {
    this.props.dispatch({
      type: 'USER_PROFILE_UPDATE_REQUEST',
      userId: this.props.user.userId,
      displayName: this.state.profileName,
      // city: this.state.profileCity,
      // country: this.state.profileCountry,
    })
    this.handleCloseProfileDialog()
    event.preventDefault()
  }


  render() {
    const { user, dispatch } = this.props

    const profileDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCloseProfileDialog}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={this.handleProfileSubmit}
      />,
    ]

    return (
      <AppBar
        style={styles.appBar}
        iconElementLeft={
          <Link to={'/'}>
            <FlatButton
              style={styles.button}
              labelPosition={'after'}
              icon={<ImageImage />}
              label={<span style={styles.buttonText}>
                Interest
              </span>}
            />
          </Link>
        }
        iconElementRight={
          <span style={styles.rightSpan}>
            {user &&
              <div>
                { /* <Link to={'/mycontent'}> */ }
                <FlatButton
                  style={styles.button}
                  labelPosition={'after'}
                  icon={<SocialPerson />}
                  label={<span style={styles.buttonText}>
                    {user.name}
                  </span>}
                  onClick={this.handleOpenProfileDialog}
                />
                <Dialog
                  title="Edit User Profile"
                  actions={profileDialogActions}
                  modal={false}
                  open={this.state.openProfileDialog}
                  onRequestClose={this.handleCloseProfileDialog}
                >
                  <div style={styles.profileForm}>
                    <div style={styles.textFieldContainer}>
                      <div style={styles.textFieldLabel}>
                        Display Name
                      </div>
                      <TextField
                        style={styles.textField}
                        type="text"
                        hintText="Display Name"
                        value={this.state.profileName}
                        onChange={this.handleChangeProfileName}
                      />
                    </div>
                    { /*
                    <div style={styles.textFieldContainer}>
                      <div style={styles.textFieldLabel}>
                        City
                      </div>
                      <TextField
                        style={styles.textField}
                        type="text"
                        hintText="City"
                        value={this.state.profileCity}
                        onChange={this.handleChangeProfileCity}
                      />
                    </div>
                    <div style={styles.textFieldContainer}>
                      <div style={styles.textFieldLabel}>
                        Country
                      </div>
                      <TextField
                        style={styles.textField}
                        type="text"
                        hintText="Country"
                        value={this.state.profileCountry}
                        onChange={this.handleChangeProfileCountry}
                      />
                    </div>
                    */ }
                  </div>
                </Dialog>
                { /* </Link> */ }
                <Link to={'#'}>
                  <FlatButton
                    style={styles.button}
                    labelPosition={'after'}
                    icon={<PowerSettingsNew />}
                    label={<span style={styles.buttonText}>
                      Log Out
                    </span>}
                    onClick={() => dispatch({ type: 'AUTH_LOGOUT_REQUEST' })}
                  />
                </Link>
              </div>
            }
            {!user && <Link to="/login">
              <FlatButton
                style={styles.button}
                labelPosition={'after'}
                icon={<ActionAccountBox />}
                label={<span style={styles.buttonText}>
                  Log In
                </span>}
              />
            </Link>}
            {!user && <Link to="/signup">
              <FlatButton
                style={styles.button}
                labelPosition={'after'}
                icon={<ActionPermIdentity />}
                label={<span style={styles.buttonText}>
                  Sign Up
                </span>}
              />
            </Link>}
          </span>
        }
      />
    )
  }
}

TopBar.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    // city: PropTypes.string,
    // country: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
}

TopBar.defaultProps = {
  user: undefined,
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(TopBar)
