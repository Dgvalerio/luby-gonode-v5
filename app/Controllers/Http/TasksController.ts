import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskValidator'

export default class TasksController {
  public async index({ params }: HttpContextContract) {
    return Task.query().where('project_id', params.project_id).preload('user')
  }

  public async store({ request, params }: HttpContextContract) {
    await request.validate(TaskValidator)
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])

    return await Task.create({
      ...data,
      projectId: params.project_id,
    })
  }

  public async show({ params }: HttpContextContract) {
    return await Task.findOrFail(params.id)
  }

  public async update({ params, request }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])

    task.merge(data)

    await task.save()

    return task
  }

  public async destroy({ params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    await task.delete()
  }
}
