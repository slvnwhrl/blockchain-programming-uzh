# UZH Blockchain Seminar - CryptoCredit

## Run Webapp Locally
There are two ways on how to run the webapp locally. We recommend the method using docker. You can connect to any
smart contract containing the CryptoCredit application (e.g. on UZH Ethereum Chain or on local Ganache deployment).

### Using Docker
Requires Docker.
Some environment parameters are set in advance and cannot be changed using the docker environment,
since the application has to be precompiled in order to be packaged as docker container. Some of the parameters,
namely the address of the smart contract, can be changed directly in the webapp. In some browsers the chance of the SmartContract can cause some issues. 
In order to resolve them, delete the local storage of your browser (namely the sc_addr entry) and refresh.

The chain ID, which identifies the correct network, cannot be set in the webapp. If you are connected to the wrong network, a warning is shown. As long as you provide a valid smart contract address,
you can fully utilize the webapp, even though you are on another network. This is useful for testing purposes, e.g. if you want to 
use the application with ganache, to have shorter transaction times. The default chain ID when using docker is 702 (UZH). If you use the docker version
with ganache, a warning will be shown. 

Run `docker-compose up -d` from the webapp root folder. Navigate to `http://localhost` or `http://localhost:80` in order to access the webapp.

You can also build a new docker image with the required environment variables. This requires npm.
To do so, set the parameters in `src/environments/environment.prod.ts` and run  `npm install` followed by `npm run build`.
Once the build is completed, you can run `docker build -t noahcha/bcuzh .` which creates a new docker image. You can run the image using `docker run -d -p 80:80 noahcha/bcuzh`. 

### Using Dev Server
Requires npm. 
If you are using this method, you can set all parameters in the `src/environments/environment.ts` file. You can set the smart contract 
address in this file or also use the method provided in the webapp. In order to get rid of the warning message displayed when connected to the
wrong network, you can set the chain ID in the environment file. The application auto-reloads.
The default chain ID in the development environment is 1337 (Ganache).

Run `npm install` followed by `npm run start` from the webapp root folder. Navigate to `http://localhost:4200/` in order to access the webapp.
