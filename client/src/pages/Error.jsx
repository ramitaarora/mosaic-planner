import { css } from '@emotion/css'
import { useEffect } from 'react';

export default function Error() {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace('/login')
        }, [1000])
    }, [])
    return (
        <div className={css`text-align: center; color: var(--line-background); margin: 20px auto;`}>
            <h1>Error! Heading back home...</h1>
        </div>
        
    )
}