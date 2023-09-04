import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({onSuccess, onError}) => {
    const handleLogin = (response) => {
        if (response.error) {
            onError(response.error)
        } else {
            onSuccess(response)
        }
    }

    return (
        <GoogleLogin onSuccess={handleLogin} onError={handleLogin}>
            <button className="google-login-button">Login with Google</button>
        </GoogleLogin>
    );
}

export default GoogleLoginButton;