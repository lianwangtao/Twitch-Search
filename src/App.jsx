import React from 'react'
import {
  AppBar,
  TextField,
  RaisedButton,
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
import axios from 'axios'

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
    this.handleKeyword = this.handleKeyword.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      keyword: ''
    }
  }

  handleKeyword(event) {
    this.setState({ keyword: event.target.value })
  }

  handleSearch(event) {
    console.log('Keyword:', this.state.keyword)
    axios.get('/search', {
      params: {
        keyword: this.state.keyword,
      },
    }).then((response) => {
      console.log('response:', response)
      this.setState({ resultsData: response.data })
    })
  }

  buildSearchBar() {
    return(
      <div
        style={{
          backgroundColor: 'white',
          padding: 30,
          display: 'flex',
        }}
        >
          <div
            style={{
            }}
            >
            <TextField
              autoFocus
              value={this.state.keyword}
              onChange={this.handleKeyword}
              hintText="Search for a stream channel here"
            />
          </div>
          <div
            style={{
              paddingLeft: 10,
              paddingTop: 5,
            }}
            >
            <RaisedButton
              href=""
              target="_blank"
              label="Search"
              primary
              onClick={this.handleSearch}
              icon={
                <i
                  className="material-icons"
                  style={{
                    color: 'white',
                  }}
                  >
                  search
                </i>
              }
              />
          </div>
      </div>
    )
  }

  buildResultList() {
    const results = []
    if (this.state.resultsData && this.state.resultsData.streams) {
      for (const stream of this.state.resultsData.streams) {
        console.log('Stream:', stream)
        const result = (
          <div
            style={{
              display: 'flex',
            }}
            >
            <img
              style={{
                flex: '1 1 0',
                width: '60%',
                height: 'auto',
              }}
              src={stream.preview.medium}
              />
            <div
              style={{
                flex: '3 1 0',
              }}
              >
              <h2>{stream.channel.display_name}</h2>
              <h3>{stream.game} - {stream.viewers} viewers</h3>
            </div>
          </div>
        )
        results.push(result)
      }
    }
    return results
  }

  buildResults() {
    if (this.state.resultsData) {
      const resultList = this.buildResultList()
      const resultCount = this.state.resultsData._total
      console.log('')
      return(
        <div>
          <div>
            <h3>Total results: {resultCount}</h3>
          </div>
          {resultList}
        </div>
      )
    }
    return "Type something to start searching!"
  }

  render() {
    const searchBar = this.buildSearchBar()
    const results = this.buildResults()

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="Twitch Search"
            iconElementLeft={
              <i
                className="material-icons"
                style={{
                  position: 'relative',
                  bottom: -8,
                  color: 'white',
                  marigin: '0 10',
                }}
                >
                live_tv
              </i>
            }
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
