import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Authors extends BaseSchema {
  protected tableName = 'authors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
