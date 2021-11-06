import MetaMaskOnboarding from '@metamask/onboarding';
import Web3 from 'web3';
import React, {useState, useEffect, useRef} from 'react';
import Button from './Button_Styled';

import {abi, networks} from './build/PasswordManager.json';


const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect Wallet';
const CONNECTED_TEXT = 'Wallet Connected';

export function OnboardingButton(props) {
  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const onboarding = useRef();

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
      return () => {
        window.ethereum.off('accountsChanged', handleNewAccounts);
        window.ethereum.off('chainChanged', (_chainId) => window.location.reload());
      };
    }
  },[]); 

//   useEffect(() => {
//     let web3 = new Web3(window.ethereum);
//     let networkID = async () => await web3.eth.net.getId();
  
//     const networkData = networks[networkID];
// if (networkData){
//   const contractAddress = networks[networkID].address;
//   const passwordManager = new web3.eth.Contract(abi, contractAddress);

//   }
// }, [accounts]);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => {
          setAccounts(newAccounts);
          // props.setAccount(newAccounts[0]);
        })
    } else {
      onboarding.current.startOnboarding();
    }
  };
  return (
    <Button disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </Button>
  );
}