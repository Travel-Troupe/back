# Travel Troupe

# Prerequisites 

* Node>=14.15.1.    
* Docker 

In order to verify your version you can launch the following command :  
```bash
$ node -v
```
Use the version managers [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) or [n](https://www.npmjs.com/package/n) in order to choose the version you are using.

## Install the project locally

* Install the project dependencies locally : 
```bash
$ yarn
```
* Copy the content of the `.env.example` file and paste it in a `.env` file.
* Launch the following command in order to run docker containers :
```bash
$ docker compose up # add the `--build --force-recreate` flags if you've added a dependency
```