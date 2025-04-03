import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        type: String,
        description: 'User name',
        example: 'Ivanov Ivan',
    })
    @IsNotEmpty({ message: 'Name is required' })
    @AutoMap()
    name: string;

    @ApiProperty({
        type: String,
        description: 'User email',
        example: 'ivan_ivanov@example.com',
    })
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @AutoMap()
    email: string;

    @ApiProperty({
        type: String,
        description: 'User password',
        example: 'StrongPassword123!',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20, { message: 'Password must not exceed 20 characters' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    password: string;
}
