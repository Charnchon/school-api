'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateGroupSchema extends Schema {
  up () {
    this.table('groups', (table) => {
      // alter table
    })
  }

  down () {
    this.table('update_groups', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UpdateGroupSchema
