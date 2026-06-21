const BaseController = require('./BaseController');
const NoticeService = require('../services/NoticeService');
const BaseDTO = require('../dtos/BaseDTO');

/**
 * Controller class for notices (Basın Açıklamaları)
 */
class NoticeController extends BaseController {
    constructor() {
        super(NoticeService, BaseDTO);
    }
}

module.exports = new NoticeController();
