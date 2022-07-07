export interface LoginCreated {
  id: string;
  token: string;
  refreshToken: string;
}

export interface LoginStored {
  id: string;
  id_user: string;
  refreshToken: string;
  createdAt: Date;
}

export interface LoggedIn {
  loggedIn: boolean;
}
