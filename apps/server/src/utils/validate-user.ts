import validator from 'validator';

import { fieldError } from './field-error';

interface NewUserArgs {
  email: string;
  name: string;
  password: string;
}

function validateUserName(name: string) {
  return true; // no name validations for now
  // return validator.isAlphanumeric(name);
}

function validateAndSanitizeNewUser(args: NewUserArgs) {
  const isEmail = validator.isEmail(args.email);

  if (!isEmail) {
    return { error: fieldError('email', 'Invalid Email') };
  }

  const isValidUserName = validateUserName(args.name);

  if (!isValidUserName) {
    return { error: fieldError('name', 'Invalid UserName') };
  }

  return {
    name: args.name.trim(),
    password: args.password.trim(),
    email: args.email.trim().toLowerCase(),
  };
}

export type { NewUserArgs };
export { validateUserName as validateUserName, validateAndSanitizeNewUser };
