import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Users } from '../givers/users.decorator';
import { Request } from 'express';
import { GoogleAuthGuard } from '../common/utils/guards';
import { User } from '../givers/users.schema';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../givers/users.services';
import { LocalAuthGuard } from './local-auth.guard';
import {
  AccountRecoveryDto,
  ChangePasswordDto,
  ConfirmVerifTokenDto,
  ResetPasswordDto,
  UpdateVerifTokenDto,
} from './auth.dto';
import {
  AccountRecoveryTokenInvalidException,
  IncorrectPasswordException,
  RecoveryTokenExistsException,
  TargetNotVerifiedException,
  TargetVerifiedException,
  TokenInvalidException,
  TokenNotFoundException,
  UserNotFoundException,
} from '../common/exceptions';
import { KeyGen } from '../common/utils/key-gen';
import { KeyType } from '../common/enums';
import { TokenHandler } from '../common/utils/token-handler';
import { TokenMedium, TokenVerifUsage } from './auth.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserPayload } from '../givers/users.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }

  @Get('status')
  user(@Req() request: Request & { user: User }) {
    console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  //normal login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login as a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'example@gmail.com',
          description: 'User email',
        },
        password: {
          type: 'string',
          example: '12345678',
          description: 'User password',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  login(@Req() req) {
    return req.user;
  }

  @Patch('verification/resend-token')
  @ApiOperation({ summary: 'Resend verification token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          example: 'exam@gmail.com or 254712345678',
          description: 'User email or phone number',
        },
        medium: {
          type: 'string',
          example: 'email or phone',
          description: 'Verification token medium',
        },
        role: {
          type: 'string',
          example: 'user',
          description: 'User role',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully resent verification token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async resendVerifToken(@Body() updateVerifTokenDto: UpdateVerifTokenDto) {
    const field =
      updateVerifTokenDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      updateVerifTokenDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';

    // Get the service class based on the role.
    const serviceClass =
      updateVerifTokenDto.role === 'USER' ? this.userService : null;

    // Find the user based on the target and field.
    const user = await serviceClass.getCredential(
      field,
      updateVerifTokenDto.target,
    );

    // Throw an error if the user is not found.
    if (!user?.phone) {
      throw UserNotFoundException();
    }

    // Check if the user  is already verified.
    if (user[fieldVerified]) {
      throw TargetVerifiedException();
    }
    //generate verification token
    const token = await KeyGen.gen(6, KeyType.NUMERIC);
    console.log(token);

    //hash token
    const tokenHash = await TokenHandler.hashKey(token);

    //get token details from db if exists
    const targetToken = await this.authService.getVerifToken({
      usage: TokenVerifUsage.CONFIRMATION,
      ...updateVerifTokenDto,
    });

    let data;

    if (!targetToken?.tokenHash) {
      //save new token to db
      data = await this.authService.addEmailToken({
        target: updateVerifTokenDto.target,
        medium: updateVerifTokenDto.medium,
        role: updateVerifTokenDto.role,
        usage: TokenVerifUsage.CONFIRMATION,
        tokenHash: await TokenHandler.hashKey(token),
      });
    }

    //update token hash
    data = await this.authService.updateVerifToken({
      target: updateVerifTokenDto.target,
      medium: updateVerifTokenDto.medium,
      role: updateVerifTokenDto.role,
      usage: TokenVerifUsage.CONFIRMATION,
      tokenHash: tokenHash,
    });

    //throw exception if not found
    if (!data?.target) {
      throw TokenNotFoundException();
    }

    //TODO: send token to user
    return { message: 'success' };
  }

  @Patch('verification/confirm-token')
  @ApiOperation({ summary: 'Confirm verification token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          example: 'exam@gmail.com or 254712345678',
          description: 'User email or phone number',
        },
        medium: {
          type: 'string',
          example: 'email',
          description: 'Verification token medium',
        },
        role: {
          type: 'string',
          example: 'user',
          description: 'User role',
        },
        token: {
          type: 'string',
          example: '123456',
          description: 'Verification token',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully resent verification token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async confirmToken(@Body() confirmVerifTokenDto: ConfirmVerifTokenDto) {
    const field =
      confirmVerifTokenDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      confirmVerifTokenDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';

    // Get the service class based on the role.
    const serviceClass =
      confirmVerifTokenDto.role === 'USER' ? this.userService : null;

    // Find the user based on the target and field.
    const user = await serviceClass.getCredential(
      field,
      confirmVerifTokenDto.target,
    );

    // Throw an error if the user is not found.
    if (!user?.phone) {
      throw UserNotFoundException();
    }

    // Check if the user or merchant is already verified.
    if (user[fieldVerified]) {
      throw TargetVerifiedException();
    }

    //get token details from db
    const token = await this.authService.getVerifToken({
      usage: TokenVerifUsage.CONFIRMATION,
      ...confirmVerifTokenDto,
    });
    console.log(token);
    //throw if not found
    if (!token?.tokenHash) {
      throw TokenNotFoundException();
    }

    //compare plain token to token hash
    const valid = await TokenHandler.verifyKey(
      token.tokenHash,
      confirmVerifTokenDto.token,
    );

    //return if both don't match
    if (
      valid !== true &&
      confirmVerifTokenDto.token != process.env.TEST_TOKEN
    ) {
      throw TokenInvalidException();
    }

    //if valid, proceed to update field
    const data = await this.userService.updateField(
      field,
      confirmVerifTokenDto.target,
      fieldVerified,
      true,
    );

    //return if operation is not successful
    if (!data?.phone && !data?.phone) {
      throw new InternalServerErrorException();
    }

    await this.authService.deleteEmailTokens({
      usage: TokenVerifUsage.CONFIRMATION,
      target: confirmVerifTokenDto.target,
      role: confirmVerifTokenDto.role,
      medium: confirmVerifTokenDto.medium,
    });

    return { message: 'success' };
  }

  @Post('account-recovery/send-token')
  @ApiOperation({ summary: 'Send account recovery token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          example: 'exam@gmail.com or 254712345678',
          description: 'User email or phone number',
        },
        medium: {
          type: 'string',
          example: 'email',
          description: 'Verification token medium',
        },
        role: {
          type: 'string',
          example: 'user',
          description: 'User role',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully resent verification token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async accountRecovery(@Body() accountRecoveryDto: AccountRecoveryDto) {
    const field =
      accountRecoveryDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      accountRecoveryDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';

    //retrieve user info
    const user = await this.userService.findUser(
      field,
      accountRecoveryDto.target,
    );

    if (!user?.userId) {
      throw UserNotFoundException();
    }

    //return if target has not yet been verified
    if (!user[fieldVerified]) {
      throw TargetNotVerifiedException();
    }

    const targetToken = await this.authService.getVerifToken({
      target: accountRecoveryDto.target,
      medium: accountRecoveryDto.medium,
      role: accountRecoveryDto.role,
      usage: TokenVerifUsage.RECOVERY,
    });

    if (targetToken?.target) {
      throw RecoveryTokenExistsException();
    }

    //generate email verification token
    const token = await KeyGen.gen(6, KeyType.NUMERIC);

    //hash token
    const tokenHash = await TokenHandler.hashKey(token);

    //save token hash and send to email
    const data = await this.authService.addEmailToken({
      target: accountRecoveryDto.target,
      medium: accountRecoveryDto.medium,
      role: accountRecoveryDto.role,
      usage: TokenVerifUsage.RECOVERY,
      tokenHash,
    });

    //throw exception if not created
    if (!data?.target) {
      throw new InternalServerErrorException();
    }
    return { message: 'success' };
  }

  @Patch('account-recovery/resend-token')
  @ApiOperation({ summary: 'Resend account recovery token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          example: 'exam@gmail.com or 254712345678',
          description: 'User email or phone number',
        },
        medium: {
          type: 'string',
          example: 'email',
          description: 'Verification token medium',
        },
        role: {
          type: 'string',
          example: 'user',
          description: 'User role',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully resent verification token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async resendToken(@Body() accountRecoveryDto: AccountRecoveryDto) {
    const field =
      accountRecoveryDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      accountRecoveryDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';

    //retrieve user info
    const user = await this.userService.findUser(
      field,
      accountRecoveryDto.target,
    );

    if (!user?.userId) {
      throw UserNotFoundException();
    }

    //return if target has not yet been verified
    if (!user[fieldVerified]) {
      throw TargetNotVerifiedException();
    }

    const targetToken = await this.authService.getVerifToken({
      target: accountRecoveryDto.target,
      medium: accountRecoveryDto.medium,
      role: accountRecoveryDto.role,
      usage: TokenVerifUsage.RECOVERY,
    });

    //throw if token is not found
    if (!targetToken?.target) {
      throw TokenNotFoundException();
    }

    //generate email verification token
    const token = await KeyGen.gen(6, KeyType.NUMERIC);

    //hash token
    const tokenHash = await TokenHandler.hashKey(token);

    //save token hash and send to email
    const data = await this.authService.updateVerifToken({
      target: accountRecoveryDto.target,
      medium: accountRecoveryDto.medium,
      role: accountRecoveryDto.role,
      usage: TokenVerifUsage.RECOVERY,
      tokenHash,
    });

    //throw exception if not successful
    if (!data?.target) {
      throw new InternalServerErrorException();
    }

    return { message: 'success' };
  }

  @Patch('account-recovery/confirm-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          example: 'exam@gmail.com or 254712345678',
          description: 'User email or phone number',
        },
        medium: {
          type: 'string',
          example: 'email',
          description: 'Verification token medium',
        },
        role: {
          type: 'string',
          example: 'user',
          description: 'User role',
        },
        token: {
          type: 'string',
          example: '123456',
          description: 'Verification token',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully resent verification token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const field =
      resetPasswordDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      resetPasswordDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';

    //retrieve user info
    const user = await this.userService.findUser(
      field,
      resetPasswordDto.target,
    );

    if (!user?.userId) {
      throw UserNotFoundException();
    }

    //return if target has nit yet been verified
    if (!user[fieldVerified]) {
      throw TargetNotVerifiedException();
    }

    const targetToken = await this.authService.getVerifToken({
      target: resetPasswordDto.target,
      medium: resetPasswordDto.medium,
      role: resetPasswordDto.role,
      usage: TokenVerifUsage.RECOVERY,
    });

    //throw if token is not found
    if (!targetToken?.target) {
      throw TokenNotFoundException();
    }

    const valid = await TokenHandler.verifyKey(
      targetToken.tokenHash,
      resetPasswordDto.token,
    );

    //throw if recovery token is wrong
    if (valid !== true && resetPasswordDto.token != process.env.TEST_TOKEN) {
      throw AccountRecoveryTokenInvalidException();
    }

    //hash new password
    const passwordHash = await TokenHandler.hashKey(resetPasswordDto.password);

    //save new password hash
    const data = await this.userService.updateField(
      field,
      resetPasswordDto.target,
      'password',
      passwordHash,
    );

    //throw if operation is not successful
    if (!data?.userId) {
      throw new InternalServerErrorException();
    }

    //delete tokens
    await this.authService.deleteEmailTokens({
      target: resetPasswordDto.target,
      medium: resetPasswordDto.medium,
      role: resetPasswordDto.role,
      usage: TokenVerifUsage.RECOVERY,
    });

    //TODO:: send password reset email

    return { message: 'success' };
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: {
          type: 'string',
          example: '123456',
          description: 'Old password',
        },
        newPassword: {
          type: 'string',
          example: '123456',
          description: 'New password',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully resent verification token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() { oldPassword, newPassword: newpassword }: ChangePasswordDto,
    @Users() { userId }: UserPayload,
  ) {
    const user = await this.userService.getCredential('userId', userId);

    if (!user?.userId) {
      throw UserNotFoundException();
    }

    const valid = await TokenHandler.verifyKey(user.password, oldPassword);

    if (valid !== true) {
      throw IncorrectPasswordException();
    }

    //hash new password
    const passwordHash = await TokenHandler.hashKey(newpassword);

    //save new password hash
    const data = await this.userService.updateField(
      'email',
      user.email,
      'password',
      passwordHash,
    );

    //return if operation is not successful
    if (!data?.userId) {
      throw new InternalServerErrorException();
    }

    return { message: 'success' };
  }
}
