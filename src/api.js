function fetchSkins () {
    return Promise.resolve( {
        skins: [
            {
                name: 'Vector',
                src: 'http://localhost:8888/w/skins/Vector/screenshots/1280x800.png'
            },
            {
                name: 'Minerva',
                src: 'http://localhost:8888/w/skins/Minerva/screenshots/1280x800.png'
            }
        ]
    } );
}

export default {
    fetchSkins
};