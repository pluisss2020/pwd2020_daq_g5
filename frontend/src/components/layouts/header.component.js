import React from 'react';
import { Link } from "react-router-dom";
import AuthOptions from '../auth/authOptions.component';

export default function Header() {
    return (
        <header id='header'>
            <Link to='/' >
                <h1 className='title'>SILO</h1>
            </Link>           
            <AuthOptions />
        </header>
    )
}
