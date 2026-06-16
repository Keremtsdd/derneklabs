const BaseController = require('./BaseController');
const AnnouncementService = require('../services/AnnouncementService');
const BaseDTO = require('../dtos/BaseDTO');

class AnnouncementController extends BaseController {
    constructor() {
        super(AnnouncementService, BaseDTO);
    }
}

module.exports = new AnnouncementController();
