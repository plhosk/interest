## Interest - a full stack Pinterest-style image board
Paul Hoskinson (plhosk@gmail.com)

![Interest app screenshot](https://raw.githubusercontent.com/plhosk/temp/master/screenshot-book-trader.png)

This is a full-stack interactive web app I wrote using Javascript.

### App Features
- Browse images submitted by users.
- Add images to the board by entering an image URL and caption.
- Preview your image before adding.
- Click on a username to show all images posted by that user.
- Image URLs that are unavailable will show a placeholder image instead.
- Images load dynamically as they scroll into view, minimizing network and CPU load.
- The layout of images is dynamic and responsive on desktop and mobile.

---

- [Try the live version on Heroku](https://interest-plhosk.herokuapp.com/) (may take a few seconds to fire up the server the first time):

- GitHub Repository: [https://github.com/plhosk/interest](https://github.com/plhosk/interest)

---

### Motivation
- This project is part of an effort to teach myself how to develop full-stack web apps. Rather than use create-react-app or another boilerplate, I wanted to learn as much as possible by building from the ground up over several iterations, while making use of some of the latest Javascript technologies. I've attempted to make the code as correct, well-structured and readable as possible, following best practices as I learn them.

### Technical Overview
This is a full-stack web app, consisting of a Node/Express API server and a React front end.

**Front end** 
- The front end is a single-page app, which is basically an interactive javascript software application running in a user's web browser. This allows for higher responsiveness and interactivity compared to a traditional static web page.
- React and Redux manage the flow and presentation of data inside the app and allow for fast development, modularity and scalability of the application.

**Server**
- The server provides a secure REST API for user authentication and communicating data with the front end.
- The server interfaces with a remote MongoDB database, allowing for persistent storage and retrieval of data.

**Development**
- The project is tailored for ease of development, with Webpack, hot reloading and linting to allow for faster iteration and fewer bugs.
- Babel provides javascript transcoding, allowing for the use of the newest ES6+ language features.

### Development Instructions
- Install [Node.js](https://nodejs.org/en/) and Git (optional)
- Clone or download the source code from the app's Git repository: `git clone https://github.com/plhosk/interest.git interest`
- Enter project folder: `cd interest`
- Install npm dependencies: `yarn` (if necessary, first install yarn globally with `npm install -g yarn`)
- Set up a local or remote MongoDB server. Rename the file ".env.example" in your project directory to ".env" and assign the URI of your Mongo server to the MONGO_URI variable (example: `MONGO_URI=mongodb://<username>:<password>@server:port/interest`)
- Start the Node/Express web server: `yarn start`
- Visit the server URL in your web browser (default port 3000): [http://localhost:3000](http://localhost:3000)
- The server provides Hot Reloading and dynamic webpack bundling in development mode. Alternatively you can build a static production bundle with `yarn build-prod` and start the production server with `yarn start-prod`
