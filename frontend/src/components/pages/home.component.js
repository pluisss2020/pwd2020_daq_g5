import React, { useEffect, useContext} from 'react'
import { useHistory  } from 'react-router-dom';
import userContext from '../../context/userContext';
import ValuesList from "../layouts/list.component";

export default function Home() {
    const { userData } = useContext(userContext);
    const history = useHistory();

    useEffect(() => {
        // Si no existe la variable usuario en userData, osea que no hay un usuario logeado,
        // te redirecciona a la pagina de login
        if (!userData.user) history.push('/login');
    });

    return (
        <div className='page'>
            <ValuesList/>
        </div>
    )
}
