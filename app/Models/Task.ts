import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import File from 'App/Models/File'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description?: string

  @column()
  public due_date?: Date

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
