import React from 'react'
import {
  AppBar,
  Card,
  CardText,
  TextField,
  FlatButton,
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
      this.setState({
        resultsData: response.data,
        totalPage: Math.ceil(response.data._total / 10)
      })
    })
  }

  buildAppBar() {
    const tvIcon = (
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
    )

    return (
      <AppBar
        title="Twitch Search"
        iconElementLeft={tvIcon}
      />
    )
  }

  buildSearchBar() {
    const searchSectionStyle = {
      backgroundColor: 'white',
      padding: 30,
      display: 'flex',
      alignItem: 'center',
      justifyContent: 'center',
    }

    return(
      <div style={searchSectionStyle}>
        <div>
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

  buildNoResult() {
    const errorIcon = (
      <i
        className="material-icons"
        style={{
          fontSize:64,
          color: 'grey',
        }}
      >
        error
      </i>
    )

    const cardTextStyle = {
      padding: '10%',
      textAlign: 'center',
    }

    return (
      <Card style={{ minHeight: 300, minWidth: 600 }}>
        <CardText style={cardTextStyle}>
          {errorIcon}
          <h2 style={{ color: 'grey' }}>
            Sorry! We can't find any results!
          </h2>
        </CardText>
      </Card>
    )
  }

  buildResultList() {

    if (this.state.totalPage === 0) {
      const noResult = this.buildNoResult()
      return noResult
    }

    if (this.state.resultsData.streams) {
      const results = this.state.resultsData.streams.map((stream, index) => {
        const name = stream.channel.display_name
        const preview = stream.preview.medium
        const game = stream.game
        const viewers = stream.viewers

        const cardStyle = {
          marginBottom: 30,
          width: '100%',
          alignSelf: 'center',
        }

        const cardTextStyle = {
          display: 'flex',
          flexDirection: 'row',
        }

        const cardImageStyle = {
          flex: '2 1 0',
        }

        const cardContentStyle = {
          flex: '3 1 0',
          position: 'relative',
          top: -15,
          paddingLeft: 10,
        }

        return (
          <Card
            key={index}
            style={cardStyle}
          >
            <CardText style={cardTextStyle}>
              <div style={cardImageStyle}>
                <img src={preview} />
              </div>
              <div style={cardContentStyle}>
                <h1>{name}</h1>
                <h3 style={{textColor: 'grey'}}>
                  {game} - {viewers} viewers
                </h3>
              </div>
            </CardText>
          </Card>
        )
      })
      return results
    }
  }

  buildPageNavigation() {
    if (this.state.resultsData && this.state.totalPage !== 0) {
      const currentPage = this.state.currentPage
      const totalPage = this.state.totalPage

      const navigationStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
      }

      const previousPage = (
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
      )

      const nextPage = (
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
      )

      const pageTextStyle = {
        position: 'relative',
        top: -6,
      }

      return(
        <div style={navigationStyle}>
          {previousPage}
          <h3 style={pageTextStyle}>
            {currentPage}/{totalPage}
          </h3>
          {nextPage}
        </div>
      )
    }
    return ''
  }

  buildContent() {
    if (!this.state.keyword) {
      const cardTextStyle = {
        padding: '10%',
        textAlign: 'center',
      }

      const searchIcon = (
        <i
          className="material-icons"
          style={{
            fontSize:64,
            color: 'grey',
          }}
        >
          search
        </i>
      )

      return (
        <Card style={{ minWidth: 800 }}>
          <CardText style={cardTextStyle}>
            {searchIcon}
            <h2 style={{ color: 'grey' }}>
              Type something to start searching!
            </h2>
          </CardText>
        </Card>
      )
    }

    if (this.state.resultsData) {
      const resultList = this.buildResultList()
      const pageNavigation = this.buildPageNavigation()
      const resultCount = this.state.resultsData._total

      const resultCountStyle = {
        flex: '1 1 0',
        textAlign: 'left',
      }

      return(
        <div style={{ minWidth: 800 }}>
          <div style={{ display: 'flex' }}>
            <div style={resultCountStyle}>
              <h3
                style={{
                  position: 'relative',
                  top: -6,
                }}
              >
                Total results: {resultCount}
              </h3>
            </div>
            <div style={{ flex: '1 1 0' }}>
              {pageNavigation}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {resultList}
          </div>
        </div>
      )
    }
  }

  render() {
    const searchBar = this.buildSearchBar()
    const content = this.buildContent()
    const appBar = this.buildAppBar()

    const contentStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          {appBar}
          <div>
            {searchBar}
          </div>
          <div style={contentStyle}>
            {content}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
