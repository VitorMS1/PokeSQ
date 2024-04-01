/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('folders', table => {
        table.increments('foldersId').primary();
        table.string('name').defaultTo('Teams list');
        table.integer('parentId').references('foldersId').inTable('folders')
        table.integer('foldersUserId').unsigned();
        table.foreign('foldersUserId').references('users.userId').onDelete('CASCADE');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('folders')
};
