import {Injectable} from '@angular/core';

import Web3 from "web3";
import Web3Modal from "web3modal";
import {Subject} from 'rxjs';

import {dapp_abi} from '../../abi'
import {ActiveBorrowing, BorrowingConditions, BorrowingRequest, Investment} from "../model/models";
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
  contractAddress: string;

  // private accountStatusSource = new Subject<any>();
  // accountStatus$ = this.accountStatusSource.asObservable();
  private errorSource = new Subject<string>();
  error$ = this.errorSource.asObservable();


  private borrowingFundedSource = new Subject<true>();
  borrowingFunded$ = this.borrowingFundedSource.asObservable();


  constructor() {
    this.contractAddress = environment.dapp_address;
    if(localStorage.getItem('sc_addr') != null) {
      this.contractAddress = localStorage.getItem('sc_addr')
    } else {
      localStorage.setItem('sc_addr', this.contractAddress);
    }

    const providerOptions = {
    }

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

  getContractAddress(): string{
    return this.contractAddress;
  }

  setContractAddress(address: string): boolean{
    this.contractAddress = address;
    localStorage.setItem('sc_addr', this.contractAddress);
    try {
      this.smartContract = new this.web3js.eth.Contract(dapp_abi, this.contractAddress);
      return true;
    } catch (e) {
        return false;
    }
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
    const request = await this.smartContract
      .methods.requestBorrowing(amount.toString(), durationMonths, income, expenses)
      .send({ from: this.accounts[0] });
    return new BorrowingConditions(request[0], request[1]);
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

  async getBorrowingConditions() {
    await this.createProviderAndWeb3();
    // this.accounts = await this.web3js.eth.getAccounts();

    // this.smartContract = new this.web3js.eth.Contract(dapp_abi, environment.dapp_address);
    const request = await this.smartContract
      .methods.getBorrowingConditions()
      .call({ from: this.accounts[0] });
    return new BorrowingConditions(request[0], request[1]);
  }

  async getActiveBorrowingAddresses() {
    await this.createProviderAndWeb3();
    const addresses = await this.smartContract
      .methods.getActiveBorrowingAddresses()
      .call({ from: this.accounts[0] });
    return addresses;
  }

  async getActiveBorrowing() {
    await this.createProviderAndWeb3();
    const borrowing = await this.smartContract
      .methods.getActiveBorrowing()
      .call({ from: this.accounts[0] });
    const ab = new ActiveBorrowing(
      parseInt(borrowing[0]),
      parseInt(borrowing[1]),
      parseInt(borrowing[2]),
      parseInt(borrowing[3]),
      borrowing[4],
      parseInt(borrowing[5]),
      borrowing[6],
      borrowing[7],
      parseInt(borrowing[8]),
      borrowing[9],
      borrowing[10],
      borrowing[11],
      parseInt(borrowing[12]),
      parseInt(borrowing[13]),
      parseInt(borrowing[14]),
    );
    return ab;
  }

  async getActiveBorrowingByAddress(address: string) {
    await this.createProviderAndWeb3();
    const borrowing = await this.smartContract
      .methods.getActiveLendingByAddress(address)
      .call({ from: this.accounts[0] });
    const ab = new ActiveBorrowing(
      parseInt(borrowing[0]),
      parseInt(borrowing[1]),
      parseInt(borrowing[2]),
      parseInt(borrowing[3]),
      borrowing[4],
      parseInt(borrowing[5]),
      borrowing[6],
      borrowing[7],
      parseInt(borrowing[8]),
      borrowing[9],
      borrowing[10],
      borrowing[11],
      parseInt(borrowing[12]),
      parseInt(borrowing[13]),
      parseInt(borrowing[14]),
    );
    ab.address = address;
    return ab;
  }

  async getInvestments() {
    await this.createProviderAndWeb3();
    const res = await this.smartContract
      .methods.getInvestments()
      .call({ from: this.accounts[0] });
    const investments: Investment[] = [];
    res.forEach(val => {
      const i = new Investment(
        val[0],
        parseInt(val[1]),
        parseInt(val[2]),
        parseInt(val[3]),
        parseInt(val[4]),
        parseInt(val[5]),
        parseInt(val[6]),
        val[7],
        val[8],
        parseInt(val[9]),
        parseInt(val[10]),
        parseInt(val[11])
      )
      investments.push(i);
    })
   return investments;
  }

  async commitBorrowing() {
    await this.createProviderAndWeb3();
    const res = await this.smartContract.methods.commitBorrowing().send({ from: this.accounts[0] });
    return res;
  }

  async isPayBackPossible() {
    await this.createProviderAndWeb3();
    const res = await this.smartContract.methods.isPayBackPossible().call({ from: this.accounts[0] });
    return res;
  }

  async packBackBorrower(amount: string) {
    await this.createProviderAndWeb3();
    const res = await this.smartContract.methods.packBackBorrower().send({ from: this.accounts[0],  value: amount });
    return res;
  }



  async investMoney(address: string, value: number) {
    await this.createProviderAndWeb3();
    const updatedValue = value * 1e18;
    const result = await this.smartContract
      .methods.investMoney(address)
      .send({ from: this.accounts[0], value: updatedValue });
    return result;
  }

  async withdrawMoney() {
    await this.createProviderAndWeb3();
    const result = await this.smartContract
      .methods.withdrawMoney()
      .send({ from: this.accounts[0]});
    return result;
  }

  async isWithdrawInvestementPossible(address: string) {
    await this.createProviderAndWeb3();
    const result = await this.smartContract
      .methods.isWithdrawInvestementPossible(address)
      .call({ from: this.accounts[0]});
    return result;
  }


  async withdrawInvestment(address: string) {
    await this.createProviderAndWeb3();
    const result = await this.smartContract
      .methods.withdrawInvestment(address)
      .send({ from: this.accounts[0]});
    return result;
  }

  async getContractTime() {
    await this.createProviderAndWeb3();
    const time = await this.smartContract
      .methods.getContractTime()
      .call({ from: this.accounts[0] });
    return time;
  }

  async setContractTime(timestamp: number) {
    await this.createProviderAndWeb3();
    const time = await this.smartContract
      .methods.setContractTime(timestamp)
      .send({ from: this.accounts[0] });
    return time;
  }

  getConnectedAccount(): string{
    return this.accounts[0];
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
      this.smartContract = new this.web3js.eth.Contract(dapp_abi, this.contractAddress);
      this.provider.on("accountsChanged", (accounts: string[]) => {
        console.log('accountsChanged', accounts);
        this.accounts = accounts;
      });

      this.smartContract.events.BorrowingFundingChanged({ filter: {value: [],},fromBlock: 'latest'}).on('data', event => {
        console.log('EVENT:');
        console.log(event);
        console.log(event.returnValues.borrowerAddress);
        console.log(event.returnValues.borrowerAddress == this.accounts[0]);
        if(event.returnValues.borrowerAddress == this.accounts[0]){
          this.borrowingFundedSource.next(true);
        }
      })

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
