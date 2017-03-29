import React from 'react'
import {
  AppBar,
  Card,
  CardText,
  CardMedia,
  TextField,
  IconButton,
  RaisedButton,
} from 'material-ui'
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
  },
})

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleKeyword = this.handleKeyword.bind(this)
    this.handlePreviousPage = this.handlePreviousPage.bind(this)
    this.handleNextPage = this.handleNextPage.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      keyword: '',
      currentPage: 1,
    }
  }

  handleSearch() {
    this.setState({ currentPage: 1 })
    this.fetchResults()
  }

  handleKeyword(event) {
    this.setState({ keyword: event.target.value })
  }

  handlePreviousPage() {
    const currentPage = this.state.currentPage
    console.log('Pre')
    if (currentPage > 1) {
      this.setState({
        currentPage: currentPage - 1
      }, function () {
        this.fetchResults()
      })
    }
  }

  handleNextPage() {
    const currentPage = this.state.currentPage
    if (currentPage < this.state.totalPage) {
      this.setState({
        currentPage: currentPage + 1
      }, function () {
        this.fetchResults()
      })
    }
  }

  fetchResults() {
    axios.get('/search', {
      params: {
        keyword: this.state.keyword,
        page: this.state.currentPage
      },
    }).then((response) => {
      console.log('response:', response)
      this.setState({
        resultsData: response.data,
        totalPage: Math.ceil(response.data._total / 10)
      })
    })
  }

  buildAppBar() {
    return (
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
    )
  }

  buildSearchBar() {
    return(
      <div
        style={{
          backgroundColor: 'white',
          padding: 30,
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'center',
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
                style={{ color: 'white' }}
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
        const id = stream.id
        const name = stream.channel.display_name
        const preview = stream.preview.medium
        const game = stream.game
        const viewers = stream.viewers

        const result = (
          <Card
            key={id}
            style={{
              marginBottom: 30,
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <CardText
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  flex: '2 1 0',
                }}
              >
                <img width="100%" height="auto" src={preview} />
              </div>
              <div
                style={{
                  flex: '3 1 0',
                  padding: 10,
                }}
                >
                <h1>{name}</h1>
                <h3
                  style={{textColor: 'grey'}}
                  >
                  {game} - {viewers}
                </h3>
              </div>
            </CardText>
          </Card>
        )
        results.push(result)
      }
    }
    return results
  }

  buildPageNavigation() {
    if (this.state.resultsData) {
      const currentPage = this.state.currentPage
      const totalPage = this.state.totalPage
      console.log('Page:', currentPage)
      console.log('Total page:', totalPage)
      return(
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          >
          <IconButton
            tooltip="Previous Page"
            tooltipPosition="top-right"
            onTouchTap={this.handlePreviousPage}
            >
            <i
              className="material-icons"
              >
              keyboard_arrow_left
            </i>
          </IconButton>
          <h3
            style={{
              position: 'relative',
              top: -6,
            }}
            >
            {currentPage}/{totalPage}
          </h3>
          <IconButton
            tooltip="Next Page"
            tooltipPosition="top-right"
            onTouchTap={this.handleNextPage}
            >
            <i
              className="material-icons"
              >
              keyboard_arrow_right
            </i>
          </IconButton>
        </div>
      )
    }
    return ''
  }

  buildResults() {
    if (this.state.resultsData) {
      const resultList = this.buildResultList()
      const pageNavigation = this.buildPageNavigation()
      const resultCount = this.state.resultsData._total

      return(
        <div
          style={{
            minWidth: '80%',
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1 1 0',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  position: 'relative',
                  top: -6,
                }}
              >
                Total results: {resultCount}
              </h3>
            </div>
            <div
              style={{
                flex: '1 1 0',
              }}
            >
              {pageNavigation}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItem: 'center',
              justifyContent: 'center',
            }}
          >
            {resultList}
          </div>
        </div>
      )
    }
    return (
      <Card
        style={{
          width: '70%',
          height: 300,
        }}
      >
        <CardText
          style={{
            padding: '10%',
            textAlign: 'center',
          }}
        >
          <i
            className="material-icons"
            style={{
              fontSize:64,
              color: 'grey',
            }}
          >
            search
          </i>
          <h2 style={{
            color: 'grey',
          }}>
            Type something to start searching!
          </h2>
        </CardText>
      </Card>
    )
  }

  render() {
    const searchBar = this.buildSearchBar()
    const results = this.buildResults()
    const appBar = this.buildAppBar()

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          {appBar}
          <div>
            {searchBar}
          </div>
          <div
            style={{
              display: 'flex',
              alignItem: 'center',
              justifyContent: 'center',
            }}
            >
            {results}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
