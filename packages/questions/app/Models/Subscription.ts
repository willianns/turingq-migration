import { DateTime } from 'luxon'
import { column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Question from 'App/Models/Question'
// Kept "User" as alias for the type for now
import User from 'App/Models/Author'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'

export default class Subscription extends IdentifiableModel {
  @column()
  public userId: string

  @column()
  public questionId: string

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @hasOne(() => Question, { foreignKey: 'questionId' })
  public question: HasOne<typeof Question>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
