import './styles.css'

const SocialConnect = () => {
    const numIcons = 7;
    const circleRadius = 153; // Radius of the main circle

    // Calculate the angle between each icon
    const angle = (360 / numIcons) * (Math.PI / 180); // Convert degrees to radians

    return (
        <div className="circle">
            <div className="small-circle"></div>
            {[...Array(numIcons)].map((_, index) => {
                // Calculate position for each icon
                const x = circleRadius * Math.cos(angle * index);
                const y = circleRadius * Math.sin(angle * index);

                return (
                    <div
                        key={index}
                        className={`icon icon${index + 1}`}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - 27px)`, // Adjusted for icon size
                            top: `calc(50% + ${y}px - 25px)`, // Adjusted for icon size
                        }}
                    ></div>
                );
            })}
        </div>
    );
}

export default SocialConnect;
