const BaseRepository = require('./BaseRepository');

class ProjectRepository extends BaseRepository {
    constructor() {
        super('projects');
    }
}

module.exports = new ProjectRepository();
