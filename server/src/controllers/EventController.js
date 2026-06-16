const BaseController = require('./BaseController');
const EventService = require('../services/EventService');
const BaseDTO = require('../dtos/BaseDTO');

class EventController extends BaseController {
    constructor() {
        super(EventService, BaseDTO);
    }
}

module.exports = new EventController();
