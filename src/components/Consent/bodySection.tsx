const CONSENT_ITEMS_LIST = [
    'Interests',
    'Reputation',
    'Badges',
    'Collections',
    'Connected Platform IDs'
]

const ConsentBody = () => {
    return (
        <>
            <p className='consent-title'>
                You are allowing <span>TheApp</span> to access data from your <span>XSmartProfile</span>:
            </p>
            <ul>
                {CONSENT_ITEMS_LIST.map((item) => (
                    <li>{item}</li>
                ))}
            </ul>
            <br />
            <hr />
            <p className='consent-warning'>Make sure you trust TheApp.</p>
            <p className='risks-info'>Learn about the <span>privacy policy</span> and <span>risks</span></p>
        </>
    )
}

export default ConsentBody
