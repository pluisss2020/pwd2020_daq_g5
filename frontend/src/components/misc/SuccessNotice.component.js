import React from 'react'
/* 
    Al requerir props en la funcion, crea nuevos atributos para utilizar en jsx
    al requerir props.message, crea un nuevo atributo llamado message. Luego para utilizarlo en register.component
    se lo llama <ErrorNotice message={valor de message} />. lo mismo aplica para clearError.
*/
export default function SuccessNotice(props) {
    return (
        <div className='success-notice'>
            <span>{props.message}</span>
            <button onClick={props.clearError}>X</button>
        </div>
    )
}
