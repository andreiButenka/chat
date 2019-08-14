import React, { Component } from 'react'
import NameInput from '../NameInput/NameInput'
import ChatInput from '../ChatInput/ChatInput'
import ChatMessage from '../ChatMessage/ChatMessage'
import DraftMessage from '../DraftMessage/DraftMessage'
import Notification  from '../Notification/Notification';
import Header from '../Header/Header';
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBListGroup } from "mdbreact";
import './Chat.css'

const URL = 'wss://wssproxy.herokuapp.com/'

class Chat extends Component {
  state = {
    from: localStorage.getItem('userName'),
    messages: [],
    draftMessages: [],
    messageStatus: undefined,
    status: 'offline',
    statusBackground: 'alert alert-success',
    ignore: true,
    title: 'Chat notification!',
    switchNotificationButtonText: 'Turn notifications off'
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.handleConnectionChange();
    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);
    this.connect()
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
  }

  connect= () => {
    this.ws.onopen = () => {
      console.log('connected')
      this.setState(state=> ({status: 'online', statusBackground: 'alert alert-success'}))
    }
    this.ws.onmessage = evt => {
      let message = JSON.parse(evt.data)
      console.log(message)
      
      if (Array.isArray(message) && message.length === 1 && typeof message[0] === 'object') {
        message = message[0]
        this.handleNotification(message.from, message.message)
      }
      this.addMessage(message)
      
    }
    this.ws.onclose = () => {
      console.log('disconnected')
      this.setState({
        status: 'offline',
        statusBackground: 'alert alert-danger'
      })
      this.ws = new WebSocket(URL)
      this.connect()
    }
  }

  

  handleConnectionChange = () => {
    let wbStatus = this.ws.readyState;
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      const webPing = setInterval(
        () => {
          fetch('//google.com', {
            mode: 'no-cors',
            })
          .then(() => {
            if (wbStatus === WebSocket.OPEN) {
              this.setState({ status: 'online', statusBackground: 'alert alert-success' }, () => {
                return clearInterval(webPing)
              });
            }
          }).catch(() => this.setState({ status: 'offline', statusBackground: 'alert alert-danger' }) )
        }, 2000);
      return;
    }
    if (this.ws.readyState === WebSocket.OPEN) {
      return this.setState({ status: 'offline', statusBackground: 'alert alert-danger' });
    }
  }

  addMessage = (message) => {
   
    if (message.length > 1) {
      this.setState(state => ({messages: message}))
      console.log('more')
    } else {
      this.setState(state => ({messages: [message, ...this.state.messages]}))
      console.log('1')
    }
  }

  submitMessage = messageString => {
    const message = { from: this.state.from, message: messageString }
    if (this.state.status !== 'online') {
      console.log('offline')
      this.setState(state => ({draftMessages: [message, ...state.draftMessages]}))
      console.log(this.state.draftMessages)
      return
    }
    this.ws.send(JSON.stringify(message))
    
  }

  closeConnection = () => {
    this.ws.close()
  }

  openConnection = () => {
    this.ws = new WebSocket(URL)
    this.connect()
  }

  clearDrawMessages = () => {
    this.setState(state => {
      state.draftMessages.length = 0
    })
  }

  resendDraftMessage = (e) => {
    const key = e.target.parentNode.id;
    this.state.draftMessages.forEach((draftMessage, index) => {
      if (index === Number(key) && this.state.status === 'online') {
        this.ws.send(JSON.stringify(draftMessage))
        this.setState(state => ({
          draftMessages: state.draftMessages.filter((message, index) => index !== Number(key))
        }))
      }
    })
  }

  deleteDraftMessage = (e) => {
    const key = e.target.parentNode.id;
    this.setState((state) => ({
      draftMessages: state.draftMessages.filter((message, index) => index !== Number(key))
    }))
  }

  handlePermissionGranted(){
    console.log('Permission Granted');
    this.setState({
      ignore: false
    });
  }

  handlePermissionDenied(){
    console.log('Permission Denied');
    this.setState({
      ignore: true
    });
  }

  handleNotSupported(){
    console.log('Web Notification not Supported');
    this.setState({
      ignore: true
    });
  }

  handleNotificationOnError(e, tag) {
    console.log(e, 'Notification error tag:' + tag);
  }

  switchNotifications() {
    if (this.state.ignore === false) {
      this.setState({
        ignore: true,
        switchNotificationButtonText: 'Turn notification on'
      });
      return;
    }  

    this.setState({
      ignore: false,
      switchNotificationButtonText: 'Turn notification off'
    });
  }

  handleNotification(from, message) {

    if (this.state.ignore) {
      console.log(this.state.ignore)
      return;
    }

    const now = Date.now();

    const title = this.state.title;
    const body = `${from}: ${message}`;
    const tag = now;
    const options = {
      tag: tag,
      body: body,
      lang: 'en',
      dir: 'ltr',
    }
    this.setState({
      title: title,
      options: options
    });
  }

  handleNameInput = (e) => {
    const { value } = e.target;
    this.setState({ from: value });
    localStorage.setItem('userName', value)
  }

  render() {
    const { from } = this.state;
    return (
      <div className="grey darken-3">
        <Notification
          ignore={this.state.ignore && this.state.title !== ''}
          notSupported={this.handleNotSupported.bind(this)}
          onPermissionGranted={this.handlePermissionGranted.bind(this)}
          onPermissionDenied={this.handlePermissionDenied.bind(this)}
          onError={this.handleNotificationOnError.bind(this)}
          timeout={5000}
          title={this.state.title}
          options={this.state.options}
          disableActiveWindow={true}
        />
        <Header 
          className={this.state.statusBackground}
          status={this.state.status}
          closeConnection={this.closeConnection.bind(this)}
          openConnection={this.openConnection.bind(this)}
          switchNotifications={this.switchNotifications.bind(this)}
          switchNotificationButtonText={this.state.switchNotificationButtonText}
        />
        <MDBCard className="chat-room blue-grey lighten-5">
          <MDBCardBody className="justify-content-center">
            <MDBRow className="justify-content-center">
              <MDBCol md="8" xl="6" className="pl-md-3 mt-4 mt-md-0 px-lg-12">
                <NameInput 
                  from={from}
                  onChange={this.handleNameInput}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="justify-content-center">
              <MDBCol md="8" xl="6" className="pl-md-3 mt-4 mt-md-0 px-lg-12">
                {/* <div className="scrollable-chat"> */}
                  <MDBListGroup className="indigo lighten-5 list-unstyled pl-3 pr-3">
                  {this.state.draftMessages.map((message, index) => {
                    return (
                      <DraftMessage
                        key={index}
                        id={index}
                        message={message.message}
                        name={message.from}
                        className="justify-content-end draft"
                        close={this.deleteDraftMessage}
                        resend={this.resendDraftMessage}
                      />
                    )
                  })}
                  {this.state.messages.map((message, index) => {
                    let messageStatus = 'justify-content-between ordinary';
                    if (message.from === this.state.from) {
                      messageStatus = 'justify-content-end active';
                    }
                    return (
                      <ChatMessage
                        key={message.id}
                        message={message.message}
                        name={message.from}
                        className={messageStatus}
                      />
                    )
                  })}
                  </MDBListGroup>
              </MDBCol>
            </MDBRow>
            <MDBRow className="justify-content-center">
              <ChatInput
                ws={this.ws}
                onSubmitMessage={messageString => this.submitMessage(messageString)}
              />
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </div>
    )
  }
}

export default Chat