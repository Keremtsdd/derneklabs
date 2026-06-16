const BaseController = require('./BaseController');
const PhotoGalleryService = require('../services/PhotoGalleryService');
const BaseDTO = require('../dtos/BaseDTO');

class PhotoGalleryController extends BaseController {
    constructor() {
        super(PhotoGalleryService, BaseDTO);
    }
}

module.exports = new PhotoGalleryController();
