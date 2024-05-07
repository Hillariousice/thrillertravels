import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const EmailAlreadyUsedException = () =>
  new ConflictException('email already in use, proceed to verify email');

export const PhoneAlreadyUsedException = () =>
  new ConflictException('phone already in use, proceed to verify phone');

export const VerifiedEmailAlreadyExistsException = () =>
  new ConflictException('verified email already exists');

export const VerifiedPhoneAlreadyExistsException = () =>
  new ConflictException('verified phone already exists');

export const RecoveryTokenExistsException = () =>
  new ConflictException('recovery token already exists');

export const AccountRecoveryTokenInvalidException = () =>
  new ForbiddenException('account recovery token is invalid or has expired.');

export const TokenNotFoundException = () =>
  new NotFoundException('token not found');

export const TokenInvalidException = () =>
  new ForbiddenException('token is invalid or has expired');

export const UserNotFoundException = () =>
  new NotFoundException('user not found');

export const TargetNotVerifiedException = () =>
  new ForbiddenException('target not verified');

export const TargetVerifiedException = () =>
  new ForbiddenException('target already verified');

export const IncorrectLoginCredentialsException = () =>
  new UnauthorizedException('login credentials are incorrect');

export const IncorrectPasswordException = () =>
  new UnauthorizedException('password is incorrect');

export const HotelNotFoundException = () =>
  new NotFoundException('hotel not found');

export const InsufficientPriviledgeException = () =>
  new ForbiddenException('access denied due to insufficient priviledges');

export const BookingNotFoundException = () =>
  new NotFoundException('booking not found');

export const BookingsNotFoundException = () =>
  new NotFoundException('bookings not found');
