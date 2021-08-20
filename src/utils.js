import { getFeaturesFromStyles, FEATURE_STYLES } from './starter-template';

function getFeatureStylesheet( key ) {
	return FEATURE_STYLES[key] || '';
}

export function getResourceLoaderSkinModuleStylesFromStylesheet( styles ) {
	return Object.keys( getFeaturesFromStyles( styles ) )
		.map( (key) => getFeatureStylesheet( key ) )
		.join('\n');
}
