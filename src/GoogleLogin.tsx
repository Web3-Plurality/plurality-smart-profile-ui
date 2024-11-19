import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Parse query parameters from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const pluralityToken = queryParams.get("pluralityToken");
        const googleAccessToken = queryParams.get("googleAccessToken");

        if (pluralityToken && googleAccessToken) {
            localStorage.setItem("pluralityToken", pluralityToken);
            localStorage.setItem("googleAccessToken", googleAccessToken);
            window.close();
            // Redirect the user to the dashboard or a specific route after processing
            //   navigate("/dashboard");
        } else {
            // Handle error or missing tokens
            console.error("Missing tokens in the URL");
            navigate("/error"); // Redirect to an error page
        }
    }, [navigate]);

    return <div>Processing your login...</div>;
};

export default GoogleLogin;
