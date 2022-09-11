interface IUserGoogle {
  result?: {
    email?: string;
    firstName?: string;
    secondName?: string;
    imageUrl?: string;
    name?: string;
    lastName?: string;
  };
  token?: string;
}

export default IUserGoogle;
