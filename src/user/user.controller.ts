import { Controller, HttpCode, UseGuards, Request, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from './user.guard';
import { User } from './schemas/user.schema';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { JwtService } from '@nestjs/jwt';
import { Handler } from './utils/handler';
import { validateAsync} from 'parameter-validator';


@Controller('user')
export class UserController {

  constructor(private userService: UserService, private jwtService: JwtService, private Handler: Handler) { }

  // Get current user
  @Get('get-user')
  async getCurrentUser(@Res() res, @Req() req) {
    console.log(req)
    // const currentUser = await this.userService.getCurrentUser(req);
    // return res.status(HttpStatus.OK).json(currentUser);
  }

  // Sign-up a user
  @Post('/sign-up')
  async signupUser(@Res() response, @Body() user: User) {
    try {
      let param = await validateAsync(user, ['firstName', 'lastName', 'cell', 'email', 'password', 'type']);
      console.log(param)
      const newUser = await this.userService.signup(user);
      let result = this.Handler.success(response, newUser);
      return result
    }
    catch (error) {
        return this.Handler.errorException(response, error);
    }
  }

  // Sign-in a user
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signinUser(@Res() response, @Body() user: User) {
    try {
      /**
       * validate user input
       */

      let param = await validateAsync(user, ['email', 'password']);
      console.log(param)
      const result = await this.userService.signin(user);
      if (result && result.status && result.status.code === 1000) {
        console.log(result)
        return response.status(200).json(result);
      }
      return response.status(401).json(result);
    }
    catch (error) {
        return this.Handler.errorException(response, error);
    }
  }

  // Sign-up a user
  @UseGuards(AuthGuard)
  @Put('edit-profile/:id')
  async editProfile(@Param('id') id: string, @Res() res, @Body() profile: User) {
    console.log(id)
    const updatedProfile = await this.userService.editProfile(id, profile);
    if (!updatedProfile) throw new NotFoundException('Post does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Profile has been successfully updated',
      profile: updatedProfile
    })
  }

  // Sign-up a user
  @UseGuards(AuthGuard)
  @Put('/change-password/:id')
  async changePassword(@Param('id') id: string, @Res() response, @Body() password: any) {
    try {
      const result = await this.userService.changePassword(password);
      if (result && result.status && result.status.code === 1000) {
        return response.status(200).json(result);
      }
      return response.status(401).json(result);
    }
    catch (error) {
      return this.Handler.errorException(response, error);
    }
  }


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
