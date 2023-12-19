export class BookingError extends Error {
  email_message: string;
  function_name: string;
  constructor(function_name: string, email_message: string) {
    super(email_message);
    this.email_message = email_message;
    this.function_name = function_name;
  }
}

export default function ErrorHandler(error: unknown, funName: string) {
  let emailContent = "";
  if (error instanceof BookingError) {
    throw error;
  } else if (error instanceof Error) {
    emailContent = `${error.message}`;
  } else {
    emailContent = `${error}`;
  }
  throw new BookingError(funName, emailContent);
}
