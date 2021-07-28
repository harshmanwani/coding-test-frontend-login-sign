import React from 'react';

const UserInfo = ({ userAccount, authToken }) => {
  return (
    <div className="userinfo">
      <p>Logged in user account address: <span className="userinfo-text">{userAccount}</span></p>
      {
        authToken
        &&
        <p>Authentication token: <span className="userinfo-text">{authToken}</span></p>
      }
    </div>
  );
};

export default UserInfo;
