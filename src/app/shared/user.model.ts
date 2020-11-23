export class User {
  constructor(
    public userId: string,
    public idToken: string,
    public expirationDate: Date,
    public email?: string,
    public fullName?: string
  ) {}
}
