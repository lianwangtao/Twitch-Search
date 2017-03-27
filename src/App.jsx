import React from 'react'
import {
  AppBar,
  TextField,
} from 'material-ui'
import {
  grey100,
  grey300,
  grey500,
  white,
  darkBlack,
  fullBlack,
} from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#6441A4',
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    shadowColor: fullBlack,
  },
})

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  buildSearchBar() {
    return(
      <div
        style={{
          backgroundColor: 'white',
          paddingLeft: 10,
          textAlign: 'center',
        }}
        >
        <i
          className="material-icons"
          style={{
            color: 'grey',
            position: 'relative',
            bottom: -8,
          }}
          >
          search
        </i>
        <TextField
          autoFocus
          hintText="Search for a stream channel here"
        />
      </div>
    )
  }

  buildResults() {
    return(
      <ul>
        <li> Result 1 </li>
        <li> Result 2 </li>
      </ul>
    )
  }

  render() {
    const searchBar = this.buildSearchBar()
    const results = this.buildResults()
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="Twitch Search"
            iconElementLeft={null}
           />
          <div>
            {searchBar}
          </div>
          <div>
            {results}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
