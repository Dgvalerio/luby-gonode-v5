import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public file: string

  @column()
  public name: string

  @column()
  public type?: string

  @column()
  public subtype?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get fullName() {
    return `${Env.get('APP_URL')}/files/${this.id}`
  }
}
