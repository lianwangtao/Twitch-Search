import React from 'react'
import ReactDOM from 'react-dom'
import * as actionCreators from '../actionCreators/perilPicker'


case : "SET_MAP_SAVE"
}

export class Element extends React.Component {
    handleMapMenuClick() {
      this.props.setMapSave();
    }

    render() {
      return (
        <div>
          <h1>Hello!</h1>
          <h2>Good to see you here.</h2>
        </div onClick{this.handleMapMenuClick()}>
      )
    }
}
