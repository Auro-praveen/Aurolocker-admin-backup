import React from 'react'
import TuckitYellowLog from '../assets/images/tuckit_yellow_fit.png'
import { Button } from '@mui/material'
import { useAuth } from '../utils/Auth'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MallAuthNav = () => {

    const Auth = useAuth();

    console.log("Sdfgsdfg")
    const navigate = useNavigate();

    useEffect(() => {
        if (!Auth.user) {
            Auth.mallAuthLogout();
            navigate("/login", {replace: true});
          }
    }, [])

    const logoutHandler = () => {
        console.log("trrtrtr")
        Auth.mallAuthLogout()
        navigate("/login", {replace: true});
    }

  return (
    <div className='mall-auth-navbar'>
        <div className="mall-auth-logo-container">
            <img src={TuckitYellowLog} alt="logo" width={200} className='tuckit-logo' />
        </div>
        <div className="mall-auth-logout-container">
            <Button className="btn-mall-auth-navbar">{Auth.user}</Button>
            <Button className="btn-mall-auth-navbar" onClick={() => logoutHandler()}>logout</Button>
        </div>

    </div>
  )
}

export default MallAuthNav