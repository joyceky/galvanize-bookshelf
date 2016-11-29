'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table){
    table.increments('id').primary();
    table.string('title').notNullable().default('');
    table.string('author').notNullable().default('');
    table.string('genre').notNullable().default('');
    table.text('description').notNullable().default('');
    table.text('cover_url').notNullable().default('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
