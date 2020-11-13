export interface Group {
  name: string;
}

export interface User {
  _id: string;
  name: string;
  superuser: boolean;
}

export interface LocalData {
  uid: string;
  token: string;
}
