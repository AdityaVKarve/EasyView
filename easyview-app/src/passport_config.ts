import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
<<<<<<< HEAD
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import dotenv from 'dotenv';
=======
import dotenv from 'dotenv';

//load the environment variables
dotenv.config();

const google_client_id = process.env.GOOGLE_CLIENT_ID || ''; // type is: string | undefined
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET || '';

console.log("Secret : "+google_client_id)
>>>>>>> d2aeb8a (Added templating and OAuth and basic UI)

dotenv.config();

// Google credentials
const google_client_id = process.env.GOOGLE_CLIENT_ID || '';
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET || '';

// Microsoft credentials
const microsoft_client_id = process.env.MICROSOFT_CLIENT_ID || '';
const microsoft_client_secret = process.env.MICROSOFT_CLIENT_SECRET || '';

console.log("Google Client ID:", google_client_id);
console.log("Microsoft Client ID:", microsoft_client_id);

// Google strategy
passport.use(new GoogleStrategy({
  clientID: google_client_id,
  clientSecret: google_client_secret,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, (token, tokenSecret, profile, done) => {
  console.log('Google Profile:', profile);
  return done(null, profile);
}));

// Microsoft strategy
passport.use(new MicrosoftStrategy({
  clientID: microsoft_client_id,
  clientSecret: microsoft_client_secret,
  callbackURL: 'http://localhost:3000/auth/microsoft/callback',
  scope: ['User.read'],
}, (accessToken, refreshToken, profile, done) => {
  console.log('Microsoft Profile:', profile);
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
