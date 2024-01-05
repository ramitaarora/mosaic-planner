export default function DailyChecks({ checks, setChecks }) {
    return (
        <div id="daily-checks">
            <h2>Daily Checks</h2>
            {checks.map((check, index) =>
                <div id="goal-line" key={index}>
                    <div id="checks-list">
                        <input type="checkbox" />
                        <label id="check-line">{check}</label>
                    </div>
                    <div id="edit-buttons">
                        <img src="./svgs/edit.svg" alt="edit" />
                        <img src="./svgs/delete.svg" alt="edit" />
                    </div>
                </div>
            )}
        </div>
    )
}