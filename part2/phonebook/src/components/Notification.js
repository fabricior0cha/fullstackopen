import React from 'react'

const successStyled = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

const erroStyled = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

const Notification = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div style={message.includes('Error') ? erroStyled : successStyled}>
            {message}
        </div>
    )
}

export default Notification