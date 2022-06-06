import * as Amqp from 'amqp-ts'
import Env from '@ioc:Adonis/Core/Env'

export default abstract class AmqpListener {

  private mapEventToQueue(eventName: string) {
    if (eventName === 'new:question') {
      return {
        name: Env.get('RABBITMQ_SUBSCRIPTIONS_REGISTRATION_QUEUE_NAME'),
        bindingKey: Env.get('RABBITMQ_SUBSCRIPTIONS_REGISTRATION_BINDING_KEY'),
      }
    }

    return {
      name: Env.get('RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_QUEUE_NAME'),
      bindingKey: Env.get('RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_BINDING_KEY'),
    }
  }

  private getAmqpConfig(eventName: string) {
    const connInfo = {
      user: Env.get('RABBITMQ_CONNECTION_USER'),
      pass: Env.get('RABBITMQ_CONNECTION_PASSWORD'),
      host: Env.get('RABBITMQ_CONNECTION_HOST'),
      port: Env.get('RABBITMQ_CONNECTION_PORT'),
    }

    return {
      connectionUri: `amqp://${connInfo.user}:${connInfo.pass}@${connInfo.host}:${connInfo.port}`,
      exchangeName: Env.get('RABBITMQ_SUBSCRIPTIONS_EXCHANGE_NAME'),
      queue: this.mapEventToQueue(eventName),
    }
  }

  protected publishMessage(eventName: string, messageContent: Record<string, unknown>) {
    const amqpConfig = this.getAmqpConfig(eventName)

    const connection = new Amqp.Connection(amqpConfig.connectionUri)

    // Declaring exchange (if deleted will be created):
    const exchange = connection.declareExchange(amqpConfig.exchangeName)

    // Declaring queue (if deleted will be created):
    const queue = connection.declareQueue(amqpConfig.queue.name)
    
    queue.bind(exchange, amqpConfig.queue.bindingKey)

    // As the connection will be async we need to execute our code
    //in the promise result for completeConfiguration event
    connection.completeConfiguration().then(() => {
      // Creating the message envelope
      const alertMessage = new Amqp.Message(messageContent)

      // Sending the message through binding key
      exchange.send(alertMessage, amqpConfig.queue.bindingKey)
    })
  }
}
