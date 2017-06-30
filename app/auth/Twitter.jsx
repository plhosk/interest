import React from 'react'
import Paper from 'material-ui/Paper'

const styles = {
  outerDiv: {
    textAlign: 'center',
    flexGrow: 1,
    marginTop: 20,
  },
  twitterImg: {
    verticalAlign: 'middle',
    width: 56,
    height: 56,
    opacity: 0.8,
  },
  githubPaper: {
    display: 'inline-block',
    margin: 10,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0)',
    borderWidth: 12,
    borderRadius: 100,
    padding: 4,
  },
  githubP: {
    marginBottom: 0,
  },
}

const Twitter = () => (
  <div style={styles.outerDiv}>
    <p style={styles.githubP}>Click to log in with <b>Twitter</b></p>
    <Paper style={styles.githubPaper} zDepth={3}>
      <a href="/api/twitter">
        <img
          style={styles.twitterImg}
          src="/twitter.png"
          alt="GitHub"
        />
      </a>
    </Paper>
  </div>
)

export default Twitter
