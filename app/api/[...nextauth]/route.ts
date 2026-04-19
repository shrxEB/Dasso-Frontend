import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ClIENT_ID!,
            clientSecret: process.env.GOOOGLE_CLIENT_SECRET!,
        }),
    ],
});
export { handler as GET, handler as POST };