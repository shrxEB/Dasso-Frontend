import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                
                try {
                    // Send request to your Express backend
                    const res = await fetch(`${BACKEND_URL}/auth/signin`, {
                        method: 'POST',
                        body: JSON.stringify({
                            username: credentials.email, // backend expects 'username'
                            password: credentials.password
                        }),
                        headers: { "Content-Type": "application/json" }
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok && data.token) {
                        try {
                            // Basic decode of JWT payload to extract user ID without needing a heavy library
                            const base64Url = data.token.split('.')[1];
                            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join(''));
                            const decoded = JSON.parse(jsonPayload);

                            // We must return an object for NextAuth
                            return { id: decoded.userId, name: credentials.email, email: credentials.email, token: data.token };
                        } catch (e) {
                            return { id: credentials.email, email: credentials.email, token: data.token };
                        }
                    }
                    return null;
                } catch (e) {
                    console.error("Login failed:", e);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                // If the user logged in with credentials, we saved the Express jwt in user.token
                if ('token' in user) {
                    token.backendToken = user.token;
                }
            }
            // Fetch backend token for Google Login
            if (account?.provider === "google" && user?.email) {
                try {
                    const res = await fetch(`${BACKEND_URL}/auth/google`, {
                        method: 'POST',
                        body: JSON.stringify({ username: user.email }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();
                    
                    // Attach backend token to NextAuth Session
                    if (res.ok && data.token) {
                        token.backendToken = data.token;
                    }
                } catch (err) {
                    console.error("Failed to connect Google login to backend", err);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.backendToken = token.backendToken;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    }
});

export { handler as GET, handler as POST };