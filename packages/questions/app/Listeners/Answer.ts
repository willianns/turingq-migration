import { EventsList } from '@ioc:Adonis/Core/Event'

import AmqpListener from './AmqpListener'

export default class Answer extends AmqpListener {
  public async onNewAnswer(answerModel: EventsList['new:answer']) {
    await answerModel.load('question')
    const answer = answerModel.toJSON()
    this.alertSubscriptions(answer, answer.question)
  }

  private alertSubscriptions(answer: Record<string, unknown>, question: Record<string, unknown>) {
    // Payload contract to send through the message
    const messageContent = {
      question: {
        id: question.id,
        title: question.title,
      },
      answer: {
        id: answer.id,
        body: answer.body,
      },
    }

    // Send the message addressed to new:answer
    this.publishMessage('new:answer', messageContent)
  }
}