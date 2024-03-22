import { Connection, connect, Channel, ConsumeMessage } from 'amqplib';
import axios from 'axios';

export default class RabbitMQConsumer {
  private static channel: Channel;

  public static async init(): Promise<void> {
    const connection: Connection = await connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('registerQueue');
    this.channel.consume('registerQueue', (msg: ConsumeMessage | null) => {
      if (msg) {
        console.log('Received:', msg.content.toString());
    
        try {
          const messageData = JSON.parse(msg.content.toString()); 
          
                   if (messageData.payload && messageData.payload.name && messageData.payload.email && messageData.payload.phone) {
            const contactData = messageData.payload; 
            const cadastroEndpoint = `http://localhost:3333/cadastro`;
    
            axios.post(cadastroEndpoint, {
              name: contactData.name,
              email: contactData.email,
              phone: contactData.phone
            })
            .then(response => {
              console.log('Contact created successfully', response.data);
            })
            .catch(error => {
              console.error('Error creating contact', error.response ? error.response.data : error);
            });
          } else {
            console.error('Invalid message structure');
          }
        } catch (error) {
          console.error('Error parsing message content', error);
        }
    
        this.channel.ack(msg);
      }
    });
  }
}
