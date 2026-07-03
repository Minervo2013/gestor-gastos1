import type { NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.microsoftId = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
