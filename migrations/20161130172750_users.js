"use strict";

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first_name').unique().notNullable().default('');
    table.string('last_name').unique().notNullable().default('');
    table.string('email').unique().notNullable();
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
