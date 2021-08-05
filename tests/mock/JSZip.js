class MockFolder {
	constructor( name ) {
		this.name = name;
		this.files = {};
	}
	folder( dir ) {
		this.files[ dir ] = new MockFolder( `${this.name}/${dir}` );
		return this.files[ dir ];
	}
	file( name, content ) {
		this.files[ `${this.name}/${name}` ] = content;
	}
	ls() {
		const allFiles = [];
		Object.keys( this.files ).forEach( ( key ) => {
			const content = this.files[ key ];
			if ( typeof content === 'string' ) {
				allFiles.push( {
					name: key,
					content
				} );
			} else {
				content.ls().forEach( ( item ) => {
					allFiles.push( item );
				} );
			}
		} );
		return allFiles;
	}
}

class MockJSZip {
	constructor() {
	}
	folder( dir ) {
		this.root = new MockFolder( dir );
		return this.root;
	}
	generateAsync() {
		return Promise.resolve();
	}
	ls() {
		return this.root.ls();
	}
}

export default MockJSZip;
