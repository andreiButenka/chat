import React from 'react'

export default ({ from, onChange }) =>
	<div className="md-form">
	  <i className="fas fa-user prefix"></i>
	  <input
	    className="form-control"
		type="text"
		placeholder={'Enter your name...'}
		value={from}
		onChange={onChange}
	  />
	</div>