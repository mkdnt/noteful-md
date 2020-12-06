import React from 'react'

function ValidationError(props) {
    if (props.message) {
        return (
        <div>
            <div>{props.message}</div>
        </div>
    )
    }else{
        return (
            <div>
                    <button type='submit'>
                        Add
                    </button>
            </div>   
        )     
    }
}

export default ValidationError