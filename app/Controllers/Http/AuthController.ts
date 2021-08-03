import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async store({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      return await auth.use('api').attempt(email, password)
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
