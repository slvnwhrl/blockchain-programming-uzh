# UzhBcDapp - Lending and Borrowing

# Deploy Smart Contract
If you want to use a pre-deployed smart contract on the UZH Ethereum chain, you can connect to the contract found at: `0x290C7723B98B4CeC002786Afc6C875c4134e49F2`.

You can also deploy the smart contract by starting a local ganache environment, and deploy the smart contract using the RemixIDE. 
Copy the address of the deployed smart contract and set it in the webapp directly or using the environment variable as described below.

# Run webapp locally
There are two ways on how to run the webapp locally. We recommend the method using docker. You can connect to any
smart contract containing the lending and borrowing application (e.g. on UZH Ethereum Chain or on local Ganache deployment).

## Using Docker
Requires Docker.
Some environment parameters are set in advance and cannot be changed using the docker environment,
since the application has to be precompiled in order to be packaged as docker container. Some of the parameters,
namely the address of the smart contract, can be changed directly in the webapp. The chain ID, which identifies the correct network, 
cannot be set in the webapp. If you are connected to the wrong network, a warning is shown. As long as you provide a valid smart contract address,
you can fully utilize the webapp, even though you are on another network. This is useful for testing purposes, e.g. if you want to 
use the application with ganache, to have shorter transaction times.

Run `docker-compose up -d` from the webapp root folder. Navigate to `http://localhost` or `http://localhost:80` in order to access the webapp.

You can also build a new docker image with the required environment variables. This requires npm.
To do so, set the parameters in `src/environments/environment.prod.ts` and run  `npm install` followed by `npm run build`.
Once the build is completed, you can run `docker build -t noahcha/bcuzh .` which creates a new docker image. You can run the image using `docker run -d -p 80:80 noahcha/bcuzh`. 

## Using Dev Server
Requires npm. 
If you are using this method, you can set all parameters in the `src/environments/environment.ts` file. You can set the smart contract 
address in this file or also use the method provided in the webapp. In order to get rid of the warning message displayed when connected to the
wrong network, you can set the chain ID in the environment file. The application auto-reloads.

Run `npm install` followed by `npm run start` from the webapp root folder. Navigate to `http://localhost:4200/` in order to access the webapp.
