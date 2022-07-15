export interface Login {
  email: string;
  password: string;
  createdAt?: Date;
}

export interface LoginCreated {
  id: string;
  token: string;
  refreshToken: string;
}

export interface LoginStored {
  id: string;
  user_id: string;
  refreshToken: string;
  createdAt: Date;
}
