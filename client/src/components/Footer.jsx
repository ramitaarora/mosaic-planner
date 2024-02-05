import { css } from '@emotion/css'

export default function Footer() {
    return (
        <footer className={css`width: 100%; text-align: center; border-top: lightgrey 1px solid; border-bottom: lightgrey 1px solid; margin-top: 10px; padding: 10px 0;`}>
            <p>© 2023</p>
        </footer>

    )
}