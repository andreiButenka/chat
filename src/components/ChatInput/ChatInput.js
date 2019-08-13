import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ChatInput.css'

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
  }

  render() {
    return (
      <form
        className="d-flex align-items-center"
        action="."
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage(this.state.message)
          this.setState({ message: '' })
        }}
      >
        <input
          className="form-control message-input"
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <input className="btn btn-primary btn-md" type="submit" value={'Send'} />
      </form>
    )
  }
}

export default ChatInput