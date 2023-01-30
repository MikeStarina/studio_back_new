class ServerError extends Error {

  status: number;


  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }


  static error400(message?: string) {
    const errMessage = message ? message : 'Некорректный запрос';
    return new ServerError(400, errMessage)
  };

  static error401(message?: string) {
    const errMessage = message ? message : 'Недостаточно прав доступа';
    return new ServerError(401, errMessage)
  };

  static error404(message?: string) {
    const errMessage = message ? message : 'Информация не найдена';
    return new ServerError(404, errMessage)
  };

  static error500(message?: string) {
    const errMessage = message ? message : 'На сервере произошла ошибка';
    return new ServerError(500, errMessage)
  };


}

export default ServerError;