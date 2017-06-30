import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImageImage from 'material-ui/svg-icons/image/image'

const styles = {
  outerDiv: {
    margin: 5,
  },
  logo: {
    height: 60,
    width: 60,
    position: 'relative',
    top: 16,
    padding: 4,
  },
  title: {
    color: '#a57c65',
    fontWeight: 'bold',
    fontSize: '3em',
    textAlign: 'center',
    lineHeight: '1em',
  },
  content: {
    maxWidth: 500,
    margin: '0 auto',
    marginBottom: 10,
  },
  li: {
    margin: 15,
  },
}

// const Introduction = () => (
class Introduction extends React.Component {
  loginTestUser = (event) => {
    event.preventDefault()
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
        <div style={styles.title}>
          <ImageImage style={styles.logo} color={'#a57c65'} />
          Interest
        </div>
        <div style={styles.content}>
          <ul>
            <li style={styles.li}>
              Welcome to Interest - a Pinterest-style image board
            </li>
            <li style={styles.li}>
              Browse images posted by other users
            </li>
            <li style={styles.li}>
              Log in to add your own images from around the web.
              Just enter the image URL and a caption
            </li>
            {(!user) ?
              <li style={styles.li}>
                Go to the top right corner to sign in
                with your Twitter or GitHub account,
                or click to log in as a&nbsp;
                <a
                  href="/signup"
                  className="styledLink"
                  role="button"
                  onClick={this.loginTestUser}
                >Test User</a>
              </li> : <li style={styles.li}>You&apos;re logged in. Feel free to
              experiment with the site&apos;s features!</li>
            }
            <li style={styles.li}>
              Check out the <a
                href="https://github.com/plhosk/interest"
                className="styledLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub repository
              </a> for more information
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
