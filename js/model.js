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
            {id: 'basic_tile', x: 1, y: 1, w: 57, h: 15},
            {id: 'moving_tile', x: 1, y: 19, w: 57, h: 15},
            {id: 'falling_tile', x: 1, y: 55, w: 57, h: 15},
        ]

        /** Just to test MVC for now */
        this.grid = [
            [0, 1, 0],
            [2, 2, 0],
            [1, 0, 1]
        ];
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
