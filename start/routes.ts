import UsersController from "#controllers/users_controller";
import router from "@adonisjs/core/services/router";
import ContactsController from "#controllers/contacts_controller";
import MessageController from "#controllers/messages_controller";

router.group(() => {
  router.get('/', () => {
    return 'connected'
  })
  router.post('/cadastro', [ContactsController, 'create']);
  router.post('/send-to-queue', [MessageController,'send']);
  router.get('/update-password', [UsersController, 'updatePassword']);
  router.post('/user/:id/update-password', [UsersController, 'updatePassword']);
  
})