import { IsEmail, IsStrongPassword, Length } from 'class-validator';
import { Field, ObjectType, ID, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, In } from 'typeorm';

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column({ unique: true })
    @Field()
    email: string;

    @Column()
    // @Field()
    hashedPassword: string;
}

@InputType()
export class UserCreateInput {
    @IsEmail()
    @Field()
    email!: string;

    @IsStrongPassword(
        {
            minLength: 12 ,
            minNumbers: 1,
            minSymbols: 1,
            minLowercase: 1,
            minUppercase: 1
        },
        {
            message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
        }
    )
    @Field()
    password!: string;
}