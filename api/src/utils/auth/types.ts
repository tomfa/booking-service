export type User = {
  username: string;
};

export type UserAuthData = User & { password: string; apiKey: string };
