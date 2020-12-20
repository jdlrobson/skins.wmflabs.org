# Development

Run this app with the following:
```
npm install
npm start
```

# Data

Data comes from https://skins.wmflabs.org/w/index.php?title=MediaWiki:Skins


## Criteria for inclusion in data

* Skins must be compatible with 1.36
* Skins must have a screenshot in the folder  https://skins.wmflabs.org/wiki/Ipsum_Lorem

# Deploying to Labs

Setup a static instance using these (https://wikitech.wikimedia.org/wiki/Help:LAMP_instances)[instructions]

Once that's done, setup Node.js environment:

```
#
sudo apt-get install npm
npm install
sudo npm run deploy
```
