/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'

let authorizationMiddleware = 'auth'
const useKeyCloak = Env.get('USE_KEYCLOAK')

if (useKeyCloak) {
  authorizationMiddleware = 'keycloak'
}

Route.group(() => {
  Route.resource('questions', 'QuestionsController').apiOnly().middleware({
    store: authorizationMiddleware,
    update: authorizationMiddleware,
    destroy: authorizationMiddleware,
  })

  Route.resource('questions.answers', 'AnswersController').apiOnly().middleware({
    store: authorizationMiddleware,
    update: authorizationMiddleware,
    destroy: authorizationMiddleware,
  })

  Route.resource('registration', 'RegistrationsController').only(['store'])

  if (!useKeyCloak) {
    Route.post('auth/login', 'AuthController.login')
    Route.get('auth/logout', 'AuthController.logout').middleware('auth')
  }
}).prefix('/api')