/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('teams', table => {
        table.increments('teamsId').primary();
        table.string('name').defaultTo('My Team');
        table.specificType('team', 'text[]');
        table.specificType('alternatives', 'text[]');
        table.integer('folderId').notNullable();
        table.integer('teamsUserId').unsigned();
        table.foreign('teamsUserId').references('users.userId').onDelete('CASCADE');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('teams')

};
