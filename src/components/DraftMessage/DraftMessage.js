import React from 'react'
import { MDBCard, MDBCardBody } from "mdbreact";
import './DraftMessage.css'

export default ({ name, message, className, close, resend, id}) =>
  <li className={`chat-message d-flex mb-4 ${className}`}>
    <MDBCard>
      <MDBCardBody>
        <div>
          <strong className="primary-font">{name}</strong>
        </div>
        <hr />
        <p className="mb-0">{message}</p>
        <div className="alert alert-danger" role="alert">
          Failed to send the message. Please check your connection
        </div>
        {/* <span>Failed to send the message. Please check your connection</span> */}
        <div id={id}>
          <button className="btn btn-danger" onClick={close}>Close</button>
          <button className="btn btn-danger" onClick={resend}>Resend</button>
        </div>
      </MDBCardBody>
    </MDBCard>
  </li>


