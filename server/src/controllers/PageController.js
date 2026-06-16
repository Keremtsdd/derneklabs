const BaseController = require('./BaseController');
const PageService = require('../services/PageService');
const BaseDTO = require('../dtos/BaseDTO');

class PageController extends BaseController {
    constructor() {
        super(PageService, BaseDTO);
    }
}

module.exports = new PageController();
