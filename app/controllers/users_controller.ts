import User from "#models/user"
import { HttpContext } from "@adonisjs/core/http"

export default class UsersController {

  public async create({ request, response }: HttpContext) {
    const userData = request.only(['fullName', 'email', 'password', 'cpf'])

    try {
      const user = await User.create(userData)
      return response.status(201).json(user)
    } catch (error) {
      return response.status(400).json({ error: 'Failed to create user.' })
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const users = await User.all()
      return response.status(200).json(users)
    } catch (error) {
      return response.status(400).json({ error: 'Failed to fetch users.' })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return response.status(200).json(user)
    } catch (error) {
      return response.status(404).json({ error: 'User not found.' })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    const userData = request.only(['fullName', 'email', 'password', 'cpf'])

    try {
      const user = await User.findOrFail(params.id)
      user.merge(userData)
      await user.save()
      return response.status(200).json(user)
    } catch (error) {
      return response.status(404).json({ error: 'User not found.' })
    }
  }

  public async updatePassword({ params, request, response }: HttpContext) {
    const newPasswordData = request.only(['password'])
    console.log(newPasswordData)
    try {
      const user = await User.findOrFail(params.id)

      user.password = newPasswordData.password

      await user.save()

      return response.status(200).json({ message: 'Password updated successfully.' })
    } catch (error) {
      return response.status(404).json({ error: 'User not found.' })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.status(204).json(user)
    } catch (error) {
      return response.status(404).json({ error: 'User not found.' })
    }
  }
}
