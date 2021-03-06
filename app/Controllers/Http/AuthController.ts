import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async store({ auth, request, response }: HttpContextContract) {
    await request.validate(AuthValidator)
    const { email, password } = request.only(['email', 'password'])

    try {
      return await auth.use('api').attempt(email, password)
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
