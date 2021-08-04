import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    return await User.query().paginate(page, limit)
  }

  public async store({ request }: HttpContextContract) {
    await request.validate(UserValidator)
    const { username, email, password } = request.only(['email', 'password', 'username'])
    const addresses = request.input('addresses')

    const trx = await Database.transaction()

    const user = await User.create({ username, email, password }, trx)

    user.useTransaction(trx).related('addresses').createMany(addresses)

    await trx.commit()

    return user
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
