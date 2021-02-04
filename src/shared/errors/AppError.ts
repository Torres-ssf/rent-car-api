interface IErrorCode {
  [key: number]: string;
}

export const errorCode: IErrorCode = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
};

export class AppError {
  public message: string | string[];

  public statusCode: number;

  constructor(message: string | string[], statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
