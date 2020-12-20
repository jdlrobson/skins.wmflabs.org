# About

This is the code that powers the app at [skins.wmflabs](https://skins.wmflabs.org).

# Development

Run this app with the following:
```
npm install
npm start
```

# Deploying to Labs

Setup a static instance using these [instructions](https://wikitech.wikimedia.org/wiki/Help:LAMP_instances).

Once that's done, setup Node.js environment:

```
#
sudo apt-get install npm
npm install
sudo npm run deploy
```
