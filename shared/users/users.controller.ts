import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenMedium, TokenVerifUsage } from '../auth/auth.enum';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KeyType, Role } from '../common/enums';
import {
  EmailAlreadyUsedException,
  PhoneAlreadyUsedException,
  VerifiedEmailAlreadyExistsException,
  VerifiedPhoneAlreadyExistsException,
} from '../common/exceptions';
import { KeyGen } from '../common/utils/key-gen';
import { TokenHandler } from '../common/utils/token-handler';
import { Users } from './users.decorator';
import { AddUserDto, UpdateProfileDto, UserPayload } from './users.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.services';
import { MailService } from '../mail/mail.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstname: {
          type: 'string',
          example: 'John',
          description: 'User first name',
        },
        lastname: {
          type: 'string',
          example: 'Doe',
          description: 'User last name',
        },
        email: {
          type: 'string',
          example: 'example@gmail.com',
          description: 'User email',
        },
        phone: {
          type: 'string',
          example: '254712345678',
          description: 'User phone number',
        },
        country: {
          type: 'string',
          example: 'KE',
          description: 'User country',
        },
        password: {
          type: 'string',
          example: 'password',
          description: 'User password',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created user',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async addUser(@Body() addUserDto: AddUserDto) {
    const data = await this.usersService.findUser('phone', addUserDto.phone);
    console.log(data);
    //return if verified phone already exists
    if (data?.phone && data?.phoneVerified) {
      throw VerifiedPhoneAlreadyExistsException();
    }

    //throw if phone exists but not verified
    if (data?.phone && !data.phoneVerified) {
      throw PhoneAlreadyUsedException();
    }

    //return if verified email already exists
    if (data?.email && data?.emailVerified) {
      throw VerifiedEmailAlreadyExistsException();
    }

    //throw if email exists but not verified
    if (data?.phone && !data.phoneVerified) {
      throw EmailAlreadyUsedException();
    }

    //hash password
    addUserDto.password = await TokenHandler.hashKey(addUserDto.password);

    const user = await this.usersService.addUser(addUserDto);
    console.log(user);

    if (!user?.userId) {
      throw new InternalServerErrorException();
    }

    //generate email verification token
    const token = await KeyGen.gen(6, KeyType.NUMERIC);
    console.log(token);

    //save token
    await this.authService.addEmailToken({
      target: addUserDto.email,
      medium: TokenMedium.EMAIL,
      role: Role.USER,
      usage: TokenVerifUsage.CONFIRMATION,
      tokenHash: await TokenHandler.hashKey(token),
    });

    // Mail Service
    await this.mailService.accountActivationMail({
      token,
      firstName: addUserDto.firstname,
      email: addUserDto.email,
    });

    //TODO: Option 2 => send email to user's phone Instead

    return {
      target: addUserDto.email,
      medium: TokenMedium.EMAIL,
      role: Role.USER,
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User id',
    example: '60f8e4d6a5c3f2f8c4b7b7a6',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched user profile',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async getProfile(@Users() { userId }: UserPayload) {
    return await this.usersService.findUser('userId', userId);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User id',
    example: '60f8e4d6a5c3f2f8c4b7b7a6',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstname: {
          type: 'string',
          example: 'John',
          description: 'User first name',
        },
        lastname: {
          type: 'string',
          example: 'Doe',
          description: 'User last name',
        },
        address: {
          type: 'string',
          example: 'Nairobi',
          description: 'User address',
        },
        dob: {
          type: 'string',
          example: '2021-07-22T00:00:00.000Z',
          description: 'User date of birth',
        },
        country: {
          type: 'string',
          example: 'KE',
          description: 'User country',
        },
        photo: {
          type: 'string',
          example:
            'https://res.cloudinary.com/dq7l8216n/image/upload/v1626971233/avatars/60f8e4d6a5c3f2f8c4b7b7a6.jpg',
          description: 'User photo',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user profile',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Users() { userId }: UserPayload,
  ) {
    return await this.usersService.updateProfile(userId, updateProfileDto);
  }
}
