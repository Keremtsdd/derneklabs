const BaseController = require('./BaseController');
const BannerService = require('../services/BannerService');
const BaseDTO = require('../dtos/BaseDTO');

class BannerController extends BaseController {
    constructor() {
        super(BannerService, BaseDTO);
    }
}

module.exports = new BannerController();
