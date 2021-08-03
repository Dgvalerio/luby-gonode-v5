import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const { email, redirect_url: url } = request.only(['email', 'redirect_url'])

      const user = await User.findByOrFail('email', email)

      user.token = string.generateRandom(16)
      user.token_created_at = new Date()

      await user.save()

      await Mail.sendLater((message) => {
        message
          .from('d@v.i')
          .to(email)
          .subject('Recuperação de senha!')
          .htmlView('emails/forgot_password', { email, token: user.token, url })
      })
    } catch (e) {
      return response.status(e.status).send({
        error: {
          message: 'Algo não deu certo, esse e-mail existe?',
        },
      })
    }
  }
}
