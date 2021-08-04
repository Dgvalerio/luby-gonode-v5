import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import { string } from '@ioc:Adonis/Core/Helpers'
import moment from 'moment'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(ForgotPasswordValidator)
    try {
      const { email, redirect_url: url } = request.only(['email', 'redirect_url'])

      const user = await User.findByOrFail('email', email)

      user.token = string.generateRandom(32)
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

  public async update({ request, response }: HttpContextContract) {
    await request.validate(ResetPasswordValidator)
    try {
      const { token, password } = request.only(['token', 'password'])

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'Esse token de recuperação expirou!',
          },
        })
      }

      user.token = undefined
      user.token_created_at = undefined
      user.password = password

      await user.save()
    } catch (e) {
      return response.status(e.status).send({
        error: {
          message: 'Algo deu errado ao resetar sua senha!',
        },
      })
    }
  }
}
