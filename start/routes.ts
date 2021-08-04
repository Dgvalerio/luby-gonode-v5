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
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/users', 'UsersController.store')
Route.get('/users', 'UsersController.index')

Route.post('/login', 'AuthController.store') //.validator('Session')

Route.post('/forgot-password', 'ForgotPasswordsController.store') //.validator('ForgotPassword')
Route.put('/forgot-password', 'ForgotPasswordsController.update') //.validator('ResetPassword')

Route.get('/files/:id', 'FilesController.show')

Route.group(() => {
  Route.post('/files', 'FilesController.store')

  Route.resource('projects', 'ProjectsController').apiOnly()
  // .validator(new Map([[['projects.store'], ['project']]]))
  Route.resource('projects.tasks', 'TasksController').apiOnly()
  // .validator(new Map([[['projects.tasks.store'], ['task']]]))
}).middleware(['auth'])
