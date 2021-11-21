import { Injectable } from '@angular/core';

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Subject } from 'rxjs';

import { dapp_abi } from '../../abi'
import {BorrowingRequest} from "../model/models";
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class SmartContractService {
  private web3js: any;
  private provider: any;
  private accounts: any;
  web3Modal: any;
  smartContract: any;
  chainId: any;

  // private accountStatusSource = new Subject<any>();
  // accountStatus$ = this.accountStatusSource.asObservable();
  private errorSource = new Subject<string>();
  error$ = this.errorSource.asObservable();

  constructor() {
    const providerOptions = {
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }

  async connectAccount() {
    this.web3Modal.clearCachedProvider();
    // this.provider = await this.web3Modal.connect(); // set provider
    // this.web3js = new Web3(this.provider); // create web3 instance
    await this.createProviderAndWeb3();
    // this.accountStatusSource.next(this.accounts);


  }

  getBalance(walletAddress: string): number {
    if(this.isConnected()){
      return this.web3js.eth.getBalance(walletAddress);
    }
    return 0;
  }

  isConnected(): boolean {
    if (this.accounts?.length > 0){
      return true
    }else {
      return false
    }
  }

  async requestBorrowing(amount: number, durationMonths: number, income: number, expenses: number) {
    await this.createProviderAndWeb3();
    // this.accounts = await this.web3js.eth.getAccounts();

    // this.smartContract = new this.web3js.eth.Contract(dapp_abi, environment.dapp_address);
    const create = await this.smartContract
      .methods.requestBorrowing(amount, durationMonths, income, expenses)
      .send({ from: this.accounts[0] });
    return create;
  }

  async getBorrowingRequest() {
    await this.createProviderAndWeb3();
    // this.accounts = await this.web3js.eth.getAccounts();

    // this.smartContract = new this.web3js.eth.Contract(dapp_abi, environment.dapp_address);
    const create = await this.smartContract
      .methods.getBorrowingRequest()
      .call({ from: this.accounts[0] });
    return new BorrowingRequest(parseInt(create[0]), parseInt(create[1]), parseInt(create[2]), parseInt(create[3]));
  }

  private async createProviderAndWeb3() {
    if(!this.provider || ! this.web3js || !this.accounts || !this.smartContract) {
      this.provider = await this.web3Modal.connect();
      this.web3js = new Web3(this.provider);
      this.accounts = await this.web3js.eth.getAccounts();
      this.chainId = await this.web3js.eth.getChainId();
      if(this.chainId !== environment.chainId) {
        this.errorSource.next('You are connected to the wrong chain! Please change to UZH Ethereum Chain.');
      }else {
        this.errorSource.next('');
      }
      this.smartContract = new this.web3js.eth.Contract(dapp_abi, environment.dapp_address);
      this.provider.on("accountsChanged", (accounts: string[]) => {
        console.log('accountsChanged', accounts);
        this.accounts = accounts;
      });

      this.provider.on("chainChanged", (chainId: number) => {
        console.log('chainChanged', chainId);
        this.chainId = parseInt(chainId.toString(), 16)
        if(this.chainId != environment.chainId) {
          console.log('here');
          this.errorSource.next('You are connected to the wrong chain! Please change to UZH Ethereum Chain.');
        } else {
          console.log('here2');
          this.errorSource.next('');
        }
      });

      this.provider.on("connect", (info: { chainId: number }) => {
        console.log('connect', info);
      });

      this.provider.on("disconnect", (error: { code: number; message: string }) => {
        console.log('disconnect', error);
      });
    }
  }

}
