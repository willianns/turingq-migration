import FormItemValidationError from '../interfaces/FormItemValidationError';

class FormValidationError extends Error {
  // eslint-disable-next-line no-unused-vars
  public constructor(public errors: FormItemValidationError[]) {
    super('Validation error');
  }
}

export default FormValidationError;
