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

# Setting up a demo site

You'll need to copy the following to LocalSettings.php
```
$wgReadOnly = 'This wiki is read only';
wfLoadSkin( 'Vector' );
wfLoadSkin('2018');
wfLoadSkin('Aether');
wfLoadSkin('Alexandria');
wfLoadSkin('Amethyst');
wfLoadSkin('Anisa');
wfLoadSkin('Apex');
wfLoadSkin('Astra');
wfLoadSkin('AtlasMuseum');
wfLoadSkin('Blue');
wfLoadSkin('BlueLL');
wfLoadSkin('BlueSky');
wfLoadSkin('Bluelib');
wfLoadSkin('Bouquet');
wfLoadSkin('Cavendish');
wfLoadSkin('Cemublue');
wfLoadSkin('CollegeInsider');
wfLoadSkin('CologneBlue');
wfLoadSkin('Cosmos');
wfLoadSkin('DGraph');
wfLoadSkin('DarkCosmos');
wfLoadSkin('DeskMessMirrored');
wfLoadSkin('Citizen');
wfLoadSkin('Dusk');
wfLoadSkin('DuskToDawn');
wfLoadSkin('Evelution');
wfLoadSkin('Example');
wfLoadSkin('Fairy');
wfLoadSkin('Femiwiki');
wfLoadSkin('Flatbox');
wfLoadSkin('Foreground');
wfLoadSkin('Gamepress');
wfLoadSkin('GreyStuff');
wfLoadSkin('GuMaxDD');
wfLoadSkin('HasSomeColours');
wfLoadSkin('Hello-Elementor');
wfLoadSkin('Hive');
wfLoadSkin('Jony');
wfLoadSkin('Kadence');
wfLoadSkin('Lakeus');
wfLoadSkin('Less');
wfLoadSkin('Marginless');
wfLoadSkin('Mask');
wfLoadSkin('Material');
wfLoadSkin('Medik');
wfLoadSkin('Metrolook');
wfLoadSkin('MinervaNeue');
wfLoadSkin('Mirage');
wfLoadSkin('Modern');
wfLoadSkin('ModernSkylight');
wfLoadSkin('Monaco');
wfLoadSkin('MonoBook');
wfLoadSkin('Neptune');
wfLoadSkin('Neve');
wfLoadSkin('Nimbus');
wfLoadSkin('Nostalgia');
wfLoadSkin('OSMFoundation');
wfLoadSkin('Oceanwp');
wfLoadSkin('Onyx');
wfLoadSkin('Pandora');
wfLoadSkin('Pivot');
wfLoadSkin('Poncho');
wfLoadSkin('Popularfx');
wfLoadSkin('Pure');
wfLoadSkin('Refreshed');
wfLoadSkin('SkinJSON');
wfLoadSkin('Splash');
wfLoadSkin('Tempo');
wfLoadSkin('Timeless');
wfLoadSkin('Truglass');
wfLoadSkin('Tunic');
wfLoadSkin('Tweeki');
wfLoadSkin('Twentynineteen');
wfLoadSkin('Twentytwenty');
wfLoadSkin('Twentytwentyone');
wfLoadSkin('Tyrian');
wfLoadSkin('Vector');
wfLoadSkin('WMAU');
wfLoadSkin('WPtouch');
wfLoadSkin('WikimediaApiPortal');
wfLoadSkin('Wisky');
wfLoadSkin('WoOgLeShades');
wfLoadSkin('erudite');
wfLoadSkin('p2wiki');
wfLoadSkin('snapwikiskin');
wfLoadSkin('strapping');
wfLoadSkin('t29v7');
```

And run the following commands:
```
git clone https://bitbucket.org/wikiskripta/medik.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/HasSomeColours
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/GreyStuff
git clone https://github.com/AWikia/SkinEvelution.git
git clone https://invent.kde.org/websites/aether-mediawiki.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Amethyst
git clone https://github.com/InternationalScratchWiki/ScratchWikiSkin2.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Modern.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Schulenburg
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/MinervaNeue.git
git clone https://github.com/pmh-only/Neptune.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Cosmos
git clone https://github.com/lingua-libre/BlueLL.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Gamepress
git clone https://github.com/morags/mediawiki-2018-skin.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/DuskToDawn
git clone https://github.com/StarCitizenTools/mediawiki-skins-Citizen.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/WoOgLeShades
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Refreshed
git clone https://anongit.gentoo.org/git/sites/wiki/skin-tyrian.git
git clone https://github.com/jdlrobson/Bluelib.git
git clone https://github.com/Dialexio/Jony.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Poncho
git clone https://github.com/Killarnee/DarkCosmos.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/MonoBook.git
git clone https://github.com/ElijahPepe/Cemublue.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Material
git clone https://github.com/librewiki/liberty-skin.git
git clone https://github.com/thingles/foreground.git
git clone https://github.com/hutchy68/pivot.git
git clone https://github.com/drriguz/Pure.git
git clone https://github.com/TheNintendofan1209/HoodWiki-tunic.git
git clone https://github.com/tealyt/Marginless-MediaWiki.git
git clone https://github.com/wikimedia/mediawiki-skins-Wisky.git
git clone https://github.com/jdlrobson/mediawiki-skins-AtlasMuseum.git
git clone https://github.com/LorenMaxwell/mediawiki-skins-lift.git
git clone https://github.com/achia70/skin-Blue.git
git clone https://github.com/jdlrobson/skin-hive.git
git clone https://github.com/jdlrobson/Alexandria.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/p2wiki
git clone https://github.com/thaider/Tweeki
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/webplatform
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Vector.git
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Anisa.git
mv mediawiki-2018-skin  2018
mv aether-mediawiki Aether
mv mediawiki-skins-apex Apex
ln -s MediaWikiWordpressThemes/Astra .
ln -s MediaWikiWordpressThemes/Fairy .
ln -s MediaWikiWordpressThemes/Kadence .
ln -s MediaWikiWordpressThemes/Hello-Elementor .
ln -s MediaWikiWordpressThemes/Neve .
ln -s MediaWikiWordpressThemes/Twentynineteen .
ln -s MediaWikiWordpressThemes/Twentytwentyone .
ln -s MediaWikiWordpressThemes/Twentytwenty .
ln -s MediaWikiWordpressThemes/Popularfx .
ln -s MediaWikiWordpressThemes/Oceanwp .
mv mediawiki-skins-AtlasMuseum/ AtlasMuseum
mv skin-Blue Blue
mv CollegeInsiderSkin/ CollegeInsider
mv mediawiki-dgraph-skin DGraph
mv DarkCosmos git-DarkCosmos
ln -s git-DarkCosmos/DarkCosmos .
mv mediawiki-skins-DeskMessMirrored DeskMessMirrored
mv mediawiki-skins-Citizen Citizen
mv SkinEvelution/ Evelution
mv mediawiki-skins-Example/ Example
mv FemiwikiSkin Femiwiki
mv mediawiki-flatbox Flatbox
mv foreground Foreground
mv mediawiki-bootstrap Bootstrap
mv mediawiki-fluent Fluent
mv mediawiki-simpletext Simpletext
mv mediawiki-skins-ForTrainingNG ForTrainingNG
mv mediawiki-skins-GuMaxDD GuMaxDD
mv mediawiki-skins-Splash Splash
mv mediawiki-skins-WMAU WMAU
mv mediawiki-skins-Wisky Wisky
mv mediawiki-skins-WPtouch WPtouch
mv mediawiki-skins-mediawiki-strapping strapping
mv mediawiki-skins-lift Lift
mv mediawiki-skins-skinjson SkinJSON
mv skin-hive Hive
mv skin-tyrian Tyrian
mv Jony Jony-git
ln -s Jony-git/Jony .
mv mediawiki-skins-Lakeus Lakeus
mv Marginless-MediaWiki  Marginless
mv medik Medik
mv osmf-mediawiki-skin OSMFoundation
mv pivot/ Pivot
mv HoodWiki-tunic/ Tunic
```

