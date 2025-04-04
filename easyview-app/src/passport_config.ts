import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: '.env' });

const google_client_id = process.env.GOOGLE_CLIENT_ID || '';
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET || '';

passport.use(new GoogleStrategy({
  clientID: google_client_id,
  clientSecret: google_client_secret,
  callbackURL: 'http://localhost:3000/auth/google/callback',
},
(token, tokenSecret, profile, done) => {
  // Here you can save the profile or user details into the session or DB
  console.log(token);
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
