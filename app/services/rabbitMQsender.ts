import { Connection, connect, Channel, Options } from 'amqplib';

export default class RabbitMQSender {
  private static channel: Channel;

  public static async init(): Promise<void> {
    const connection: Connection = await connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('registerQueue');
  }

  public static async send(data: { payload: object; routing_key: string; headers: object }): Promise<boolean> {
    const message = JSON.stringify(data.payload);

    const options: Options.Publish = {
      contentType: 'application/json',
      headers: data.headers,
    };

    return this.channel.sendToQueue(data.routing_key, Buffer.from(message), options);
  }
}

