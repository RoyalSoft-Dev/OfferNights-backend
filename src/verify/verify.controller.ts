import { Controller, HttpCode, UseGuards, Request, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete, Req } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { User } from './schemas/verify.schema';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { JwtService } from '@nestjs/jwt';
import { Handler } from './utils/handler';
import { validateAsync} from 'parameter-validator';


@Controller('verify')
export class VerifyController {

  constructor(private verifyService: VerifyService, private jwtService: JwtService, private Handler: Handler) { }

  // Sign-up a user
  @Post('/email-verify')
  async emailVerify(@Res() response, @Body() email: string) {
    try {
      const token = await this.verifyService.verify(email);
      return token;
    }
    catch (error) {
        return this.Handler.errorException(response, error);
    }
  }

  // Check token
  @Post('/check-token')
  async checkToken(@Res() response, @Body() token: string) {
    console.log("first")
    try {
      const check = await this.verifyService.check(token);
      // let result = this.Handler.success(response, check);
      return check;
    }
    catch (error) {
        return this.Handler.errorException(response, error);
    }
  }
}
