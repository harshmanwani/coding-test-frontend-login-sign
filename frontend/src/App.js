import { useEffect, useReducer, useState } from "react";
import axios from 'axios';

import * as actionTypes from './store/actionTypes';
import { appReducer, initState } from "./store/reducer";
import { GET_AUTH_TOKEN_API, GET_NONCE_API } from "./API";

import LoginButton from "./components/LoginButton";
import UserInfo from "./components/UserInfo";

import './app.css'

function App() {

  const [isMetaMask, setMetaMask] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [state, dispatch] = useReducer(appReducer, initState);


  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      setMetaMask(true);
      const userAccount = window.ethereum.selectedAddress
      if (userAccount) {
        dispatch({ type: actionTypes.SET_USER, payload: { userAccount } });
      }
    }
  }, [])


  const fetchNonce = async () => {
    return new Promise((resolve, reject) => {
      axios.get(GET_NONCE_API)
        .then(response => {
          const { status, data } = response;
          if (status === 200) {
            console.log(data);
            dispatch({ type: actionTypes.SET_NONCE, payload: { nonce: data } });
            resolve(data);
          } else {
            console.log(response)
            reject()
          }
        })
        .catch(err => {
          console.log(err)
          reject();
        });
    })
  };

  const getAuthToken = async (signature, address, nonce) => {
    const response = await axios.post(GET_AUTH_TOKEN_API, { signature, address, nonce }) || {};
    return response.data;
  };

  const signMessage = async (address, nonce) => {
    try {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          address,
          `Signing the message with: ${nonce}`,
        ]
      }
      );
      return signature;
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await fetchNonce()
        .then(async nonce => {

          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const userAccount = accounts[0]
          dispatch({ type: actionTypes.SET_USER, payload: { userAccount } });


          const signature = await signMessage(userAccount, nonce);
          const authToken = await getAuthToken(signature, userAccount, nonce);

          dispatch({ type: actionTypes.SET_AUTH_TOKEN, payload: { authToken } });

          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  if (!isMetaMask) {
    return <h2>Please install <a href="https://metamask.io">MetaMask</a> first to login with it</h2>
  }

  return (
    <div className="App">
      <h2>🦊 Welcome to the login with MetaMask demo 🦊</h2>
      <LoginButton
        login={login}
        isLoading={isLoading}
        authToken={state.authToken}
      />
      {
        state.userAccount
        &&
        <UserInfo userAccount={state.userAccount} authToken={state.authToken} />
      }
    </div>
  );
}

export default App;
