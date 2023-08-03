import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './schemas/profile.schema';
import { JwtModule } from '@nestjs/jwt';
import { Handler } from './utils/handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    JwtModule.register({
      secret: "sew9939pwpppwpeokdffjfjriru44030423-edmmfvnvdmjrp4l4k",
      signOptions: { expiresIn: '1h' },
    }),
    ProfileModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, Handler],
})
export class ProfileModule {
}
