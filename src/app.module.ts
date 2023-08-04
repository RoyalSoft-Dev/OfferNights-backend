import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';
import { VerifyModule } from './verify/verify.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/users', {}),
    BlogModule,
    UserModule,
    ProfileModule,
    VerifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
