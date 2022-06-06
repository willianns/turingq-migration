import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RemoveSubscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up () {
    this.schema.dropTable(this.tableName)
  }

  public async down () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('user_id')
        .notNullable()
        .references('authors.id')
        .onDelete('CASCADE')

      table.string('question_id')
        .notNullable()
        .unsigned()
        .references('questions.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }
}
