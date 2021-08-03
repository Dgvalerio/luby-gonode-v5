import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = string.generateRandom(16)
      user.token_created_at = new Date()

      await user.save()

      return user
    } catch (e) {
      return response.status(e.status).send({
        error: {
          message: 'Algo não deu certo, esse e-mail existe?',
        },
      })
    }
  }
}
