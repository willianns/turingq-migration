import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import RegistrationValidator from 'App/Validators/RegistrationValidator'
import Env from '@ioc:Adonis/Core/Env'
import KeyCloakAdminClient from '@keycloak/keycloak-admin-client'

export default class RegistrationsController {
  public async store({ request, response }: HttpContextContract) {
    const useKeycloak = Env.get('USE_KEYCLOAK')
    const payload = await request.validate(RegistrationValidator)

    const user = new User()
    user.name = payload.name
    user.email = payload.email
    user.password = payload.password

    if (useKeycloak) {
      const keycloakUser = await this.createKeycloakUser(
        payload.name,
        payload.email,
        payload.password
      )

      user.id = keycloakUser.id;
    }

    await user.save()

    return response.created(user.toJSON())
  }

  private async getKeycloakAdminClient(): Promise<KeyCloakAdminClient> {
    const keyCloakAdminClient = new KeyCloakAdminClient({
      baseUrl: Env.get('KEYCLOAK_AUTH_SERVER_URL'),
      realmName: Env.get('KEYCLOAK_REALM'),
    })

    await keyCloakAdminClient.auth({
      grantType: 'client_credentials',
      clientId: Env.get('KEYCLOAK_CLIENT_ID'),
      clientSecret: Env.get('KEYCLOAK_CLIENT_SECRET'),
    })

    return keyCloakAdminClient
  }

  private async createKeycloakUser(
    name: string,
    email: string,
    password: string
  ): Promise<{ id: string; email: string }> {
    const keycloakAdminClient = await this.getKeycloakAdminClient()

    const { id } = await keycloakAdminClient.users.create({
      username: email,
      email: email,
      firstName: name,
      emailVerified: true,
      enabled: true,
    })

    await keycloakAdminClient.users.resetPassword({
      id,
      credential: {
        temporary: false,
        type: 'password',
        value: password,
      },
    })

    return {
      id,
      email,
    }
  }
}
