import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeUpdate,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import File from 'App/Models/File'
import Mail from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description?: string

  @column()
  public due_date?: Date

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public fileId: number

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  @beforeUpdate()
  public static async sendNewTaskMail(taskInstance: Task) {
    if (!taskInstance.userId && !taskInstance.$dirty.userId) return
    if (taskInstance.userId) await taskInstance.load('user')
    if (taskInstance.fileId) await taskInstance.load('file')

    const { title } = await taskInstance
    const file = await taskInstance.file
    const { email, username } = await taskInstance.user

    await Mail.sendLater((message) => {
      message
        .from('d@v.i')
        .to(email)
        .subject('Nova tarefa para você!')
        .htmlView('emails/new_task', { username, title, hasAttachment: !!file })

      if (file)
        message.attach(Application.tmpPath(`uploads/${file.file}`), {
          filename: file.name,
        })
    })
  }
}
