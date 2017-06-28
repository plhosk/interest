import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImageImage from 'material-ui/svg-icons/image/image'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  outerDiv: {
    backgroundColor: '#f1f1f2',
    borderRadius: 40,
    fontSize: '1.1em',
    lineHeight: '1.8em',
    padding: 0,
  },
  logo: {
    height: 60,
    width: 60,
    position: 'relative',
    top: 16,
    padding: 4,
  },
  title: {
    color: '#1995ad',
    fontSize: '3em',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: '1em',
  },
  content: {
    maxWidth: 500,
    margin: '0 auto',
    color: '#1995ad',
    marginBottom: 25,
  },
}

// const Introduction = () => (
class Introduction extends React.Component {
  loginTestUser = () => {
    this.props.dispatch({
      type: 'AUTH_LOGIN_REQUEST',
      username: 'test',
      password: 'test',
    })
  }

  render() {
    const { user } = this.props
    return (
      <div style={styles.outerDiv}>
        <h2 style={styles.title}>
          <ImageImage style={styles.logo} color={'#755248'} />
          Interest
        </h2>
        <div style={styles.content}>
          <ul>
            <li>
              Interest - a full stack Pinterest-style image board
            </li>
            {(!user) ?
              <li>
                Click to log in as a &nbsp;<RaisedButton
                  label="Test user"
                  onClick={this.loginTestUser}
                />
                &nbsp; or create your own account to try out the site&apos;s features.
              </li> : <li>You&apos;re logged in. Feel free to
              experiment with the site&apos;s features!</li>
            }
            <li>
              While logged in, click your username in the top right corner to
              edit your profile.
            </li>
            <li>
              Check out this app&rsquo;s source code on <a
                href="https://github.com/plhosk/interest"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>.
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

Introduction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
}

Introduction.defaultProps = {
  user: undefined,
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

// export default Introduction
export default connect(mapStateToProps)(Introduction)
