import React from 'react'
import { Link } from 'react-router-dom'
import './noAccessDes.css'

export const NoAccess = () => {
  return (
    <div className='no-access-frame'>
        <div className="no-access">
            <h2  className='frame-header'>You have no access</h2>
            <h4 className='header-4'>back to</h4>
            <Link to={'/'}>
                <h4 className='dashLink'>dashboard</h4>
            </Link>
        </div>
    </div>
  )
}
