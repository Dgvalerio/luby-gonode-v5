import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Application from '@ioc:Adonis/Core/Application'

export default class FilesController {
  public async store({ request, response }: HttpContextContract) {
    try {
      if (!request.file('file'))
        return response.status(500).send({ error: { message: 'Erro no upload de arquivo' } })

      const upload = request.file('file', { size: '2mb' })

      if (!upload)
        return response.status(500).send({ error: { message: 'Erro no upload de arquivo' } })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Application.tmpPath('uploads'), {
        name: fileName,
      })

      return await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      })
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    return response.download(Application.tmpPath(`uploads/${file.file}`))
  }
}
