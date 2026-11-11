import { Module } from '@nestjs/common';
import { UsersService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}