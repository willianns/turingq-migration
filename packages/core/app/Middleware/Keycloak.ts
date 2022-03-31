import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

class KeycloakMiddleware {
  private tokenSignaturePublicKey: string

  constructor() {
    this.tokenSignaturePublicKey = Env.get('KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY')
  }

  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let token: string = request.header('Authorization')

    if (token) {
      const formattedTokenSignaturePublicKey = `-----BEGIN PUBLIC KEY-----\r\n${this.tokenSignaturePublicKey}\r\n-----END PUBLIC KEY-----`

      try {
        const decodedAccessToken = jwt.verify(
          token.replace(/^Bearer /, ''),
          formattedTokenSignaturePublicKey
        )

        request['user'] = {
          id: decodedAccessToken.sub,
          email: decodedAccessToken['email'],
          name: decodedAccessToken['name'],
        }
      } catch (e) {
        Logger.error({ err: new Error(e.message) }, 'token validation error')
        response.unauthorized({error: 'Ivalid token'})
        return null;
      }

      await next();
      return null;
    }

    response.unauthorized({ error: 'Token not present' })
  }
}


export default KeycloakMiddleware
