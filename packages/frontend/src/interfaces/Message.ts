interface Message {
  type: 'error' | 'success' | 'warning';
  body: string;
}

export default Message;
