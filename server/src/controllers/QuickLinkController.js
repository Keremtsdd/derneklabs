const BaseController = require('./BaseController');
const QuickLinkService = require('../services/QuickLinkService');
const BaseDTO = require('../dtos/BaseDTO');

class QuickLinkController extends BaseController {
    constructor() {
        super(QuickLinkService, BaseDTO);
    }
}

module.exports = new QuickLinkController();
