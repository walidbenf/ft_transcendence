import { SetMetadata } from '@nestjs/common';

export const jwtConstant = {
	secret: process.env.JWT_CONSTANT
  };

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);