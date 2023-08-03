import { Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as gravatar from 'gravatar';
import { Handler } from './utils/handler';
import { User, UserDocument } from './schemas/user.schema';
import nodemailer, {createTransport} from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { EmailAddress, EmailPassword } from './utils/secret';
import { normalize } from 'path';

@Injectable()
export class UserService {

  private transporter: nodemailer.Transporter;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly Handler: Handler, private readonly jwtService: JwtService) { }

  async getCurrentUser(): Promise<User[]> {
    const currentUser = await this.userModel.find().exec();
    return currentUser;
  }

  async editProfile(id: string, profile: User): Promise<User> {
    const updatedProfile = await this.userModel
      .findByIdAndUpdate(id, profile, { new: true });
    return updatedProfile;
  }


  async verify(email) {
    console.log(email, EmailAddress, EmailPassword)

    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      // requireTLS: true,
      auth: {
        user: EmailAddress,
        pass: EmailPassword,
      },
      logger: true
    });

    // send mail with defined transport object
    const info = await this.transporter.sendMail({
      from: EmailAddress,
      to: "smiledev10162@gmail.com",
      subject: "Hello from node",
      text: "Hello world?",
      // headers: { 'x-myheader': 'test header' }
    });

    console.log("Message sent: %s", info.response);
  }

  async getOne(email): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async signup(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);

    const avatar = normalize(
      gravatar.url(user.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })
    )

    const reqBody = {
        type: user.type,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        avatar: avatar,
        cell: user.cell,
        email: user.email,
        password: hash,
        termAgree: user.termAgree
    }
    const newUser = new this.userModel(reqBody);
    let responseData = await newUser.save();
    return responseData
  }

  async signin(user: User): Promise<any> {
      try {
          const foundUser = await this.userModel.findOne({ email: user.email }).exec();
          if (foundUser) {
              const { password } = foundUser;
              let checkPassword = await bcrypt.compare(user.password, password);
              if (checkPassword) {
                  const payload = { id: foundUser.id };
                  let token = await this.jwtService.signAsync(payload);
                  return this.Handler.successResponse({ 'token': 'Bearer '+token, 'user': foundUser })
              }
              return this.Handler.erroresponse(HttpStatus.BAD_REQUEST, 'Incorrect username or password');
          }
          return this.Handler.erroresponse(HttpStatus.BAD_REQUEST, 'Incorrect username or password');
      } catch (error) {
          return this.Handler.erroresponse(HttpStatus.BAD_REQUEST, 'something went wrong please try again later');
      }
  }

  // async editPost(postID, createPostDTO: CreateUserDTO): Promise<User> {
  //   const editedPost = await this.userModel
  //     .findByIdAndUpdate(postID, createPostDTO, { new: true });
  //   return editedPost;
  // }

  // async deletePost(postID): Promise<any> {
  //   const deletedPost = await this.userModel
  //     .findByIdAndRemove(postID);
  //   return deletedPost;
  // }

}
