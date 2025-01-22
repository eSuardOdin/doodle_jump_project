/**
 * 0, plateforme normale: 1, 1, 57, 15
 * Will contain path to tilemap
 * Maybe an array of object representing tiles in tilemap (id, x, y, width, height)
 */
export default class Model {
    constructor()
    {
        console.log('Model constructed');
        /** Position of tiles on the tilemap */
        this.tiles = [
            {id: 'basic_tile',   x: 1, y: 1, w: 57, h: 15},
            {id: 'moving_tile',  x: 1, y: 19, w: 57, h: 15},
            {id: 'falling_tile', x: 1, y: 55, w: 57, h: 15},
            {id: 'bg',           x: 662, y: 333, w: 46, h: 64}
        ]

        /** Just to test for now */
        this.map_array = [
            {type: 'basic_tile', x: 50, y: 12},
            {type: 'basic_tile', x: 30, y: 75},
            {type: 'falling_tile', x: 10, y: 200},
            {type: 'moving_tile', x: 100, y: 40},
        ]
    }

    /**
     * 
     * @param {String} id The id of the tile to return 
     * @returns tile object (position of tile on tilemap)
     * @description Returns a tile object depending on it's id.
     * As `array.filter()` returns an array and we only need one element
     * we return the first element. -- Refactor ? --
     */
    getTile(id) {
        return this.tiles.filter(t => t.id === id)[0];
    }
}
