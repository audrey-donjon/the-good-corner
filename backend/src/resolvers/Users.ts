import { JwtPayload } from './../../node_modules/@types/jsonwebtoken/index.d';
import { User, UserCreateInput } from './../entities/User';
import { Arg, Mutation, Resolver, Ctx, Query } from "type-graphql";
import { validate } from "class-validator";
import { hash, verify } from 'argon2';
import { sign, verify as jwtVerify} from 'jsonwebtoken';
import Cookies from 'cookies';
import { getUserFromContext } from '../auth';
import { ContextType } from '../auth';

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    // for user, we have to validate the data input (beacause of password & hashed password)
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    const newUser = new User();

    try{
      const hashedPassword = await hash(data.password);
      Object.assign(newUser, data, {
        hashedPassword,
        password: undefined,
      });
      await newUser.save();

    // send email for validation

      return newUser;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while creating the user");
    }
  }
  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: ContextType
  ): Promise<User> {
    // search user by email
    // compare password using argon2
    try{
      const user = await User.findOneBy({ email });
      if (user) {
        if(await verify(user.hashedPassword, password)){
          // generate token
          const token = sign(
            {
              id: user.id
            }, process.env.JWT_SECRET_KEY);

          // verify token
          // try{
          //   const JwtPayload =  jwtVerify(token, process.env.JWT_SECRET);
          // }catch(error){
          //   console.error(error);
          //   throw new Error("An error occurred while signing in");
          // }

          const cookies = new Cookies(context.req, context.res);

          cookies.set('token', token, {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 72, // 3 days
          })

          return user;
        }else{
          return null;
        }
      }else{
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async signout(
    @Ctx() context: ContextType
  ): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set('token', '', {
      maxAge: 0,
    });
    return true;
  }

  @Query(() => User, { nullable: true })
  async whoami(
    @Ctx() context: ContextType
  ): Promise<User> | null {
    return await getUserFromContext(context);
  }

}
