import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsISO31661Alpha2,
  IsStrongPassword,
  IsDate,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly lastname: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @IsISO31661Alpha2()
  readonly country: string; //country or province

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsStrongPassword(
    {},
    {
      message:
        'password is not strong enough. password should fulfill the following: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}  ',
    },
  )
  password: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly firstname?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly lastname?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly address?: string;

  @IsNotEmpty()
  @IsDate()
  readonly dob?: Date;

  @IsNotEmpty()
  @IsString()
  @IsISO31661Alpha2()
  readonly country?: string; //country or province

  @IsNotEmpty()
  @IsString()
  readonly photo?: string;
}

export type UserPayload = Readonly<{
  email: string;
  userId: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}>;

// Path: bookings/src/bookings/bookings.dto.ts
export class AddBookingDto {
  @IsString()
  @MaxLength(50)
  fromWhere: string;

  @IsString()
  @MaxLength(50)
  toWhere: string;

  @Type(() => Date) // This will transform the input to a Date object
  @IsNotEmpty()
  leaveOn: Date;

  @Type(() => Date) // Same here for the return date
  @IsNotEmpty()
  returnOn: Date;

  @IsString()
  typeOfTrip: string; // Assuming TypeOfTrip is an enum represented as a string

  @IsNumber()
  numberOfPassengers: number;

  @IsString()
  type: string; // Assuming Type is an enum represented as a string

  @IsNumber()
  ticketNumber: number;

  @IsNumber()
  bookingNumber: number;

  @IsString()
  typeOfPayment: string; // Assuming TypeOfPayment is an enum represented as a string

  @IsNumber()
  amountPaid: number;

  @IsString()
  currency: string;

  @IsString()
  typeOfPassenger: string; // Assuming TypeOfPassenger is an enum represented as a string
}

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fromWhere?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  toWhere?: string;

  @IsOptional()
  @Type(() => Date)
  leaveOn?: Date;

  @IsOptional()
  @Type(() => Date)
  returnOn?: Date;

  @IsOptional()
  @IsString()
  typeOfTrip?: string; // Assuming TypeOfTrip is an enum represented as a string

  @IsOptional()
  @IsNumber()
  numberOfPassengers?: number;

  @IsOptional()
  @IsString()
  type?: string; // Assuming Type is an enum represented as a string

  @IsOptional()
  @IsNumber()
  ticketNumber?: number;

  @IsOptional()
  @IsNumber()
  bookingNumber?: number;

  @IsOptional()
  @IsString()
  typeOfPayment?: string; // Assuming TypeOfPayment is an enum represented as a string

  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  typeOfPassenger?: string; // Assuming TypeOfPassenger is an enum represented as a string
}
