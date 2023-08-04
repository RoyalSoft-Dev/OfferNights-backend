import { Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as gravatar from 'gravatar';
import { Handler } from './utils/handler';
import { User, UserDocument } from './schemas/verify.schema';
import nodemailer, {createTransport} from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { EmailAddress, EmailPassword } from './utils/secret';
import { normalize } from 'path';
import jwt from 'jsonwebtoken';

@Injectable()
export class VerifyService {

  private transporter: nodemailer.Transporter;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly Handler: Handler, private readonly jwtService: JwtService) { }

  async verify(email) {
    const payload = { email: email }
    let token = await this.jwtService.signAsync(payload);

    try {
      const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "smiledev10162@gmail.com",
          pass: "gxhfpitxwxjcxyhn",
        },
      });
  
      await transporter.sendMail({
        from: 'smiledev10162@gmail.com',
        to: email,
        subject: "OfferNights",
        text: "Your verification token is " + token + ". You can verify your email.",
      });
      console.log("email sent sucessfully");
    } catch (error) {
      console.log("email not sent");
      console.log(error);
    }
  }

  async check(token: string) {
    try {
      const email = jwt.verify(token, 'secret');
      // const email: string = decodedToken.email;
      return email;
    } catch (error) {
      return 'Error verifying email token:';
    }
  }

  async generateRandomNumber(min: number, max: number): Promise<number> {
    // Generate a random decimal between 0 and 1
    const randomDecimal = Math.random();
  
    // Scale the random decimal to the desired range
    const randomNumber = await Math.floor(randomDecimal * (max - min + 1)) + min;
  
    return randomNumber;
  }
}
