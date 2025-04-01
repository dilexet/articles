export interface ITokenType {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInMilliseconds: number;
  refreshTokenExpiresInMilliseconds: number;
}

export interface ITokenPayloadType {
  userId: string;
}
