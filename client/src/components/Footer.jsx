import { css } from '@emotion/css'

export default function Footer() {
    return (
        <footer className={css`width: 100%; text-align: center; margin-top: 10px; padding: 10px 0; font-size: 10px;`}>
            <p>© 2023 Mosaic Planner</p>
        </footer>

    )
}