/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('favorites', table => {
        table.increments('favoritesId').primary();
        table.integer('pokemonId').notNullable()
        table.integer('favoritesUserId').unsigned();
        table.foreign('favoritesUserId').references('users.userId').onDelete('CASCADE');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('favorites');
};
