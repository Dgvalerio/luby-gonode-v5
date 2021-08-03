import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async index({}: HttpContextContract) {
    return Project.query().preload('user')
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = request.only(['title', 'description'])

    return Project.create({ ...data, userId: auth.user?.id })
  }

  public async show({ params }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)

    await project.load('user')
    await project.load('tasks')

    return project
  }

  public async update({ params, request }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title', 'description'])

    project.merge(data)

    await project.save()

    return project
  }

  public async destroy({ params }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}
