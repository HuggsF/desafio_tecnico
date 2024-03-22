import amqp from 'amqplib';

const RABBITMQ_URL: string = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
let channel: amqp.Channel | null = null;
const queuesAssured: { [key: string]: boolean } = {};

async function startRabbitMQ() {

  const hostname = process.env.NODE_ENV === 'production' ? 'rabbitmq' : 'localhost';
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: hostname,
    port: 5672,
    username: 'guest',
    password: 'guest',
  });

  const channel = await connection.createChannel();

  await channel.assertQueue('registerQueue', {
    durable: true,
  });

  console.log('RabbitMQ started and queue registerQueue asserted');
}

async function getChannel(): Promise<amqp.Channel> {
  if (channel) return channel;

  const connection: amqp.Connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}

async function assureQueue(queueName: string): Promise<void> {
  if (queuesAssured[queueName]) return;
  
  const ch = await getChannel();
  await ch.assertQueue(queueName, {
    durable: true,
  });
  queuesAssured[queueName] = true;
  console.log(`Fila ${queueName} assegurada.`);
}
async function sendToQueueWithHeaders(queueName: string, message:object, headers = {}) {
  await assureQueue(queueName);
  if (!channel) throw new Error("Channel is not initialized");
  
  const messageObj = { payload: message };
  
  const messageStr = JSON.stringify(messageObj);
  
  const options = {
    persistent: true,
    headers: headers
  };
  
  channel.sendToQueue(queueName, Buffer.from(messageStr), options);
  console.log(`[x] Sent message  ${messageObj}`);
}

async function consume(queueName: string, callback: (msg: string) => void): Promise<void> {
  await assureQueue(queueName);
  if (!channel) throw new Error("Channel is not initialized");

  channel.consume(queueName, message => {
    if (message) {
      console.log(`[x] Received ${message.content.toString()}`);
      callback(message.content.toString());
      channel!.ack(message);
      
    }
    
  })
}

export { sendToQueueWithHeaders, consume, startRabbitMQ };
