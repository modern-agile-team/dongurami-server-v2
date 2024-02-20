import { RootController } from '@src/apis/root/controllers/root.controller';
import { ApiOperator } from '@src/types/type';

export const ApiRoot: ApiOperator<keyof RootController> = {};
