const BaseRepository = require('./BaseRepository');

class PhotoGalleryRepository extends BaseRepository {
    constructor() {
        super('photo_gallery');
    }
}

module.exports = new PhotoGalleryRepository();
