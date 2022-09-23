# LN Filestore Front-end

LN Filestore Front-end provides a web application to buy and/or sell files through the Lightning network. 

The front-end relies on the [LN Filestore server](https://github.com/Asone/LNFilestoreServer) and is mainly intended to be used as an [umbrel](https://umbrel.com/) app.

It is built with NextJS and React.

## Run

Default port for the application is `9999`.

You can use a docker image to run the application :

x86 processors : 
> docker run akbarworld/lnfilestorefront

arm64 processors :
> docker run akbarworld/lnfilestorefront:umbrel

If you want to run it on a docker-compose you can find an example in my [umbrel-apps](https://github.com/Asone/umbrel-apps/blob/master/lnfilestore/docker-compose.yml) fork. 

## Build

You can also build yourself the application and run it directly.

### On host

> yarn install && yarn build

### host serve

> yarn serve

### dev

> yarn dev

### Build through docker : 

> Docker build .

## API Reference

See the server's [route documentation]()
