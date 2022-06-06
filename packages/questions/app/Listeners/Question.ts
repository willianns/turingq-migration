import { EventsList } from '@ioc:Adonis/Core/Event'

import AmqpListener from './AmqpListener'

export default class Question extends AmqpListener {
  public async onNewQuestion(questionModel: EventsList['new:question']) {
    // Loads author from the question received
    await questionModel.load('author')

    const question = questionModel.toJSON()

    this.subscribeAuthor(question, question.author)
  }


  private subscribeAuthor(question: Record<string, unknown>, author: Record<string, unknown>) {
    // Payload contract to send through the message
    const messageContent = {
      question: {
        id: question.id,
      },
      subscriber: {
        id: author.id,
        email: author.email,
      },
    }

    // Send the message addressed to new:question
    this.publishMessage('new:question', messageContent)
  }

}