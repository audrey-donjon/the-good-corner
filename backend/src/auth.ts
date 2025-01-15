import Cookies from "cookies";
import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { User } from "./entities/User";

export type ContextType = { req: any, res: any, user: User | null | undefined }
export type AuthContextType = ContextType & { user: User }

export async function getUserFromContext(context: ContextType): Promise<User | null> {
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get('token');
    if (!token) {
        return null;
    }
    try{
        const payload =  verify(
        token,
        process.env.JWT_SECRET_KEY
        ) as unknown as {
        id: number
        };

        const user = await User.findOneBy({
        id: payload.id
        });

        return user;
    }catch{
        return null;
    }
}

export const authChecker: AuthChecker<ContextType> = async (
    { root, args, context, info },
    roles,
    ) => {
        // Read user from context
        // and check the user's permission against the `roles` argument
        // that comes from the '@Authorized' decorator, eg. ["ADMIN", "MODERATOR"]
        const user = await getUserFromContext(context);
        context.user = user;
        if(user){
            return true;
        }else{
            return false;
        }
    };