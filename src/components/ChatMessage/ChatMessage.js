import React from 'react'
import { MDBCard, MDBCardBody } from "mdbreact";
import './ChatMessage.css'

export default ({ name, message, className }) =>
  <li className={`chat-message d-flex mb-4 ${className}`}>
  <MDBCard>
    <MDBCardBody>
      <div>
        <strong className="primary-font">{name}</strong>
      </div>
      <hr />
      <p className="mb-0">{message}</p>
    </MDBCardBody>
  </MDBCard>
  </li>
  // <p className={className}>
  //   <strong>{name}</strong> <em>{message}</em>
  // </p>

