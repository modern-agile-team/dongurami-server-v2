import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  // (data: unknown, ctx: ExecutionContext) =>
  () => {
    // const request = ctx.switchToHttp().getRequest();
    return {
      id: Math.floor(Math.random() * 100), // 0 ~ 100
      clubId: [Math.floor(Math.random() * 100)], // 0~ 100
      name: '정비호',
      profilePath: 'https://image.png',
      isAdmin: 0,
    };
  },
);
