import React from 'react'
import Paper from 'material-ui/Paper'

const styles = {
  outerDiv: {
    textAlign: 'center',
    flexGrow: 1,
    marginTop: 20,
  },
  githubImg: {
    verticalAlign: 'middle',
    width: 64,
    height: 64,
    opacity: 0.8,
  },
  githubPaper: {
    display: 'inline-block',
    margin: 10,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0)',
    borderWidth: 12,
    borderRadius: 100,
  },
  githubP: {
    marginBottom: 0,
  },
}

const Github = () => (
  <div style={styles.outerDiv}>
    <p style={styles.githubP}>Or, click to authenticate<br />using your GitHub account:</p>
    <Paper style={styles.githubPaper} zDepth={3}>
      <a href="/api/github">
        <img
          style={styles.githubImg}
          src="/github.png"
          alt="GitHub"
        />
      </a>
    </Paper>
  </div>
)

export default Github
