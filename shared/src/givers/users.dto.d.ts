export declare class AddUserDto {
    readonly firstname: string;
    readonly lastname: string;
    readonly phone: string;
    readonly email: string;
    readonly country: string;
    password: string;
}
export declare class UpdateProfileDto {
    readonly firstname?: string;
    readonly lastname?: string;
    readonly address?: string;
    readonly dob?: Date;
    readonly country?: string;
    readonly photo?: string;
}
export type UserPayload = Readonly<{
    email: string;
    userId: string;
    phone: string;
    emailVerified: boolean;
    phoneVerified: boolean;
}>;
export declare class AddBookingDto {
    fromWhere: string;
    toWhere: string;
    leaveOn: Date;
    returnOn: Date;
    typeOfTrip: string;
    numberOfPassengers: number;
    type: string;
    ticketNumber: number;
    bookingNumber: number;
    typeOfPayment: string;
    amountPaid: number;
    currency: string;
    typeOfPassenger: string;
}
export declare class UpdateBookingDto {
    fromWhere?: string;
    toWhere?: string;
    leaveOn?: Date;
    returnOn?: Date;
    typeOfTrip?: string;
    numberOfPassengers?: number;
    type?: string;
    ticketNumber?: number;
    bookingNumber?: number;
    typeOfPayment?: string;
    amountPaid?: number;
    currency?: string;
    typeOfPassenger?: string;
}
