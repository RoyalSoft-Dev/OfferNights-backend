import { Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Handler } from './utils/handler';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileService {

  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>, private readonly Handler: Handler, private readonly jwtService: JwtService) { }

  // async getPosts(): Promise<User[]> {
  //   const posts = await this.userModel.find().exec();
  //   return posts;
  // }

  // async getPost(postID): Promise<User> {
  //   const post = await this.userModel
  //     .findById(postID)
  //     .exec();
  //   return post;
  // }

  async getOne(email): Promise<Profile> {
    return await this.profileModel.findOne({ email }).exec();
  }

  async addProfile(profile: Profile): Promise<Profile> {
    const reqBody = {
        tradeName: profile.tradeName,
        email: profile.email,
        brokerageAddress: profile.brokerageAddress,
        brokerageCity: profile.brokerageCity,
        brokeragePostalCode: profile.brokeragePostalCode,
        brokeragePhone: profile.brokeragePhone,
        picture: profile.picture,
        activeAreas: profile.activeAreas,
    }
    const addProfile = new this.profileModel(reqBody);
    let responseData = await addProfile.save();
    return responseData
  }

  async editProfile(profileId, profile: Profile): Promise<Profile> {
    const editedProfile = await this.profileModel
      .findByIdAndUpdate(profileId, profile, { new: true });
    return editedProfile;
  }

//   async signin(user: User): Promise<any> {
//       try {
//           const foundUser = await this.userModel.findOne({ email: user.email }).exec();
//           if (foundUser) {
//               const { password } = foundUser;
//               let checkPassword = await bcrypt.compare(user.password, password);
//               if (checkPassword) {
                
//                   const payload = { email: user.email };
                  
//                   let token = this.jwtService.sign(payload);
//                   return this.Handler.successResponse({ token })
//               }
//               return this.Handler.erroresponse(HttpStatus.BAD_REQUEST, 'Incorrect username or password');
//           }
//           return this.Handler.erroresponse(HttpStatus.BAD_REQUEST, 'Incorrect username or password');
//       } catch (error) {
//           return this.Handler.erroresponse(HttpStatus.BAD_REQUEST, 'something went wrong please try again later');
//       }
//   }

  

  // async deletePost(postID): Promise<any> {
  //   const deletedPost = await this.userModel
  //     .findByIdAndRemove(postID);
  //   return deletedPost;
  // }
  
}
