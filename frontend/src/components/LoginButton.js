import React from 'react';

const LoginButton = ({ login, isLoading, authToken }) => {
  return (
    <button
      onClick={login}
      disabled={isLoading || authToken}
      className={`${isLoading && "loading"} ${authToken && "loggedIn"}`}
    >
      {
        isLoading
          ? <span>
            Loading...
          </span>
          :
          authToken ? "Logged in 🚀" : "Log in with MetaMask"
      }
    </button>
  );
};

export default LoginButton;
