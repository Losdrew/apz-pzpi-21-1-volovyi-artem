export interface AuthResultDto {
  userId?: string;
  bearer?: string | undefined;
  role?: string;
}

export interface SignInCommand {
  email?: string | undefined;
  password?: string | undefined;
}

export interface CreateCustomerCommand  {
  email?: string | undefined;
  password?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  phoneNumber?: string | undefined;
}