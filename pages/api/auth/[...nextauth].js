import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import getLogger from "@/lib/shared/logger";
import GoogleProvider from "next-auth/providers/google";

const logger = getLogger("NextAuth");

export default NextAuth({
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Form Data
          const data = {
            name: profile?.name,
            email: profile?.email,
            avatar: session?.user.picture,
            // Add other properties to the data object as needed
          };

          const response = await fetch(
            `${process.env.API_URL}/auth/google/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to send user data to the backend");
          }

          const result = await response.json();
          console.log("Response Data ", result);

          user = { ...result?.user };

          user["accessToken"] = result?.access_token;
        } catch (error) {
          console.error(error);
        }
      }

      console.log("Monyancha 1");

      // Persist the OAuth access_token to the token right after signin
      if (user) {
        console.log("Monyancha 2");
        // console.log("Credentials", token);
        const filteredUser = {
          name: user.name,
          role: user.role,
          phone: user.phone,
          code: user.code,
          accessToken: user.accessToken,
          user_id: user.id,
          gender: user.gender,
        };
        // token.accessToken = user.access_token
        token = { ...token, ...filteredUser };
        console.log("the filtered value is " + filteredUser);
      }
      console.log("Monyancha 3");
      return token;
    },
    

    async session({ session, token, user }) {
      console.log("Monyancha 4");
      // Send properties to the client, like an access_token from a provider.
      let customUser = { ...token };
      session = { user: customUser };
      console.log("Your session", session);
      return session;
    },
  },
  
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log("Monyancha 5");
        const accessToken = credentials.token ?? null;

        const body = JSON.stringify(credentials);
        logger.info("Authorizing: ", body);
        console.log("Monyancha 5", body);

        if (!accessToken) {
          console.log("Monyancha 6", body);
          const resp = await fetch(`${process.env.API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body,
          })
            .then(async (response) => {
              console.log("Monyancha 7.1");
              let data = null;
              try {
                data = await response.json();
              } catch (e) {
	        console.log("Monyancha 7.1.5", e);

                data = await response.text();
                throw data;
              }

              console.log("Monyancha 7.2", data);

              logger.info("authorize", data);
              if (!response.ok) {
                if (response.status === 401) {
                  throw data;
                }
                throw JSON.stringify({ message: "Could not log you in" });
              }

              console.log("Monyancha 8");

              return data;
            })
           .catch((error) => {
              console.log("Monyancha 10");
              console.log(error);
              if (error) {
                logger.warn("Unauthorized::UNCAUGHT ", error);
                throw new Error(error);
              }
              logger.warn("Unauthorized::OTHER ", error);
              throw new Error(error);
            });

            console.log("Monyancha 11");

          console.log("The Resp is" + resp);
          return {
            ...resp.user,
            accessToken: resp.access_token,
          };
        }

        console.log("Monyancha 12");

        // We have a token, try it out
        const resp = await fetch(`${process.env.API_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accepts: "application/json",
            Authorization: `Bearer ${accessToken} `,
          },
        })
          .then(async (response) => {
            const data = await response.json();

            logger.info("authorize", data);
            if (!response.ok) {
              if (response.status === 401) {
                throw data;
              }
              throw { message: "Could not log you in" };
            }

            return data;
          })
          .then((data) => {
            logger.info("Authorized: ", data);
            return data;
          })
          .catch((error) => {
            console.log(error);
            if (error) {
              logger.warn("Unauthorized::UNCAUGHT ", error);
              throw new Error(error);
            }
            logger.warn("Unauthorized::OTHER ", error);
            throw new Error(error);
          });

        console.log("Auth body is ", resp);

        return {
          ...resp,
          accessToken,
        };
      },
    }),

    //GoogleProvider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

});
