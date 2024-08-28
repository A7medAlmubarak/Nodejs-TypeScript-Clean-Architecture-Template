import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { User } from "../domain/entities/User";
import { OAuth } from "../domain/entities/OAuth";
import { connectToDatabase } from "../infrastructure/database";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  const client = await connectToDatabase();
  const userRepository = client.getRepository(User);
  const oauthRepository = client.getRepository(OAuth);

  let user = await userRepository.findOne({ where: { googleId: profile.id } });

  if (!user) {
    user = userRepository.create({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails?.[0]?.value
    });
    await userRepository.save(user);
  }

  const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  const oauth = oauthRepository.create({
    provider: 'google',
    accessToken: jwtToken,
    refreshToken: refreshToken,
    user: user
  });
  await oauthRepository.save(oauth);

  return done(null, user);
}));

passport.serializeUser((user: Express.User, done) => {
  const typedUser = user as User;
  done(null, typedUser.id);
});

passport.deserializeUser(async (id: string, done) => {
  const client = await connectToDatabase();
  const userRepository = client.getRepository(User);

  const user = await userRepository.findOne({ where: { id: parseInt(id) } });
  done(null, user);
});