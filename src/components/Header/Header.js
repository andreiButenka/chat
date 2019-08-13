import React from 'react'
import { MDBCardBody, MDBRow, MDBCol } from "mdbreact";

export default ({ className, status, closeConnection, openConnection, switchNotifications, switchNotificationButtonText}) =>
	<>
		<MDBCardBody>
			<MDBRow className="justify-content-center">
				<MDBCol md="6" xl="6" className="pl-md-3 mt-4 mt-md-0 px-lg-12">
					<div className={`d-flex justify-content-center ${className}`} role="alert">
						{status}
					</div>
				</MDBCol>
			</MDBRow>
			<MDBRow className="justify-content-center">
				<MDBCol md="6" xl="6" className="d-flex justify-content-center flex-wrap pl-md-3 mt-2 mt-md-0 px-lg-12">
					<button className="btn btn-danger" onClick={closeConnection}>Close</button>
					<button className="btn btn-success" onClick={openConnection}>Open</button>
					<button className="btn btn-light" onClick={switchNotifications}>{switchNotificationButtonText}</button>
				</MDBCol>
			</MDBRow>
		</MDBCardBody>
	</>
 