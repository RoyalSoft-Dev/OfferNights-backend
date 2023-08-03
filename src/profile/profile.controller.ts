import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './schemas/profile.schema';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { JwtService } from '@nestjs/jwt';
import { Handler } from './utils/handler';
import { validateAsync} from 'parameter-validator';


@Controller('profile')
export class ProfileController {

  constructor(private profileService: ProfileService, private jwtService: JwtService, private Handler: Handler) { }

  // Edit a particular email
  @Put('/edit-profile')
  async editProfile(@Res() res, @Query('profileId', new ValidateObjectId()) profileId, @Body() profile: Profile) {
    const editedProfile = await this.profileService.editProfile(profileId, profile);
    if (!editedProfile) throw new NotFoundException('Profile does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Profile has been successfully updated',
      post: editedProfile
    })
  }

  // Sign-up a user
  // @Post('/add-profile')
  // async addProfile(@Res() response, @Body() profile: Profile) {
  //   try {
  //     /**
  //      * validate missing params
  //      */
  //     // let param = await validateAsync(profile, ['cell', 'email', 'password', 'brokerageAddress', 'brokerageCity', 'brokeragePostalCode', 'brokeragePhone']);
  //     let param = await validateAsync(profile, ['email']);
  //     /**
  //      * saving user record
  //      */
  //     const newProfile = await this.profileService.addProfile(profile);
  //     let result = this.Handler.success(response, newProfile);
  //     return result
  //   }
  //   catch (error) {
  //       return this.Handler.errorException(response, error);
  //   }
  // }

  // // Sign-in a user
  // @Put('/edit-profile')
  // async editProfile(@Res() response, @Body() profile: Profile) {
  //   try {
  //     /**
  //      * validate user input
  //      */

  //     let param = await validateAsync(profile, ['email', 'password']);
  //     const result = await this.userService.signin(profile);
  //     if (result && result.status && result.status.code === 1000) {
  //         return response.status(200).json(result);
  //     }
  //     return response.status(401).json(result);
  //   }
  //   catch (error) {
  //       return this.Handler.errorException(response, error);
  //   }
  // }

  // @Delete('/delete-profile')
  // async signinUser(@Res() response, @Body() user: User) {
  //   try {
  //     /**
  //      * validate user input
  //      */

  //     let param = await validateAsync(user, ['email', 'password']);
  //     const result = await this.userService.signin(user);
  //     if (result && result.status && result.status.code === 1000) {
  //         return response.status(200).json(result);
  //     }
  //     return response.status(401).json(result);
  //   }
  //   catch (error) {
  //       return this.Handler.errorException(response, error);
  //   }
  // }

  // // Fetch all posts
  // @Get('sign-in')
  // async getPosts(@Res() res) {
  //   console.log("sign-in")
  //   const posts = await this.userService.getPosts();
  //   return res.status(HttpStatus.OK).json(posts);
  // }

  // // Fetch a particular post using ID
  // @Get('post/:postID')
  // async getPost(@Res() res, @Param('postID', new ValidateObjectId()) postID) {
  //   const post = await this.userService.getPost(postID);
  //   if (!post) throw new NotFoundException('Post does not exist!');
  //   return res.status(HttpStatus.OK).json(post);

  // }

  

  // // Delete a post using ID
  // @Delete('/delete')
  // async deletePost(@Res() res, @Query('postID', new ValidateObjectId()) postID) {
  //   const deletedPost = await this.userService.deletePost(postID);
  //   if (!deletedPost) throw new NotFoundException('Post does not exist!');
  //   return res.status(HttpStatus.OK).json({
  //     message: 'Post has been deleted!',
  //     post: deletedPost
  //   })
  // }
}
