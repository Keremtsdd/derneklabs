const BaseService = require('./BaseService');
const photoGalleryRepo = require('../repositories/PhotoGalleryRepository');

class PhotoGalleryService extends BaseService {
    constructor() {
        super(photoGalleryRepo, true);
    }
}

module.exports = new PhotoGalleryService();
