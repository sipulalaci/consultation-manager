import { JwtService } from '@nestjs/jwt';

export const jwtDecoder = async (authToken: string, jwtService: JwtService) => {
  const token = authToken.replace('Bearer ', '');
  const { sub } = await jwtService.verifyAsync(token);
  return sub;
};
