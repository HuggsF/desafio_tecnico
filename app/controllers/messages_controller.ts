// app/Controllers/Http/MessagesController.ts

import { sendToQueueWithHeaders } from '#start/rabbitMQ';
import { HttpContext } from '@adonisjs/core/http';


export default class MessageController {
  public async send({ request, response }: HttpContext) {
    
    const { payload, routing_key, headers } = request.only(['payload', 'routing_key', 'headers']);

    try {
      if (!payload || !routing_key) {
        return response.badRequest({ error: 'Missing required fields' });
      }

      await sendToQueueWithHeaders(routing_key, payload, headers);
      console.log('Message sent');
      return response.ok({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      return response.internalServerError({ error: 'Failed to send message' });
    }
  }
}
