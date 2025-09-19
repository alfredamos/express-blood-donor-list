import {Token} from "@prisma/client"
import prisma from "../db/prisma.db";

export class TokenModel {
    //----> Create new token.
    async createToken(token: Token) {
        return prisma.token.create({data: token});
    }

    async findByAccessToken(token: string){
        return await prisma.token.findUnique({where: {accessToken: token}})
    }

    //----> Find all valid tokens
    async findAllValidTokensByUser(userId: string): Promise<Token[]> {

        return prisma.token.findMany({where: {userId, revoked: false, expired: false}});
    };

    //----> Revoked and render expired all valid tokens by giving user-id.
    async revokedAllUserTokens(userId: string){
        //----> Fetch all valid tokens.
        const validUserTokens = await tokenModel.findAllValidTokensByUser(userId);

        console.log("In revoked-all-user-tokens, validUserTokens : ", validUserTokens);

        //----> Invalidate all valid tokens
        if (!validUserTokens?.length) return;
        const filteredTokens = validUserTokens.map(async (token) => {
            const updatedToken = {
                ...token,
                revoked:true,
                expired: true,
            }

            return await prisma.token.update({where: {id: updatedToken.id}, data: updatedToken});

        });

        //----> Send back the results.
        return Promise.all(filteredTokens);

    }


}

export const tokenModel = new TokenModel()