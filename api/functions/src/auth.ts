import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { slugify } from './utils/slug.utils';

admin.initializeApp();

const db = admin.firestore();

export const createUserRecord = functions.auth
  .user()
  .onCreate((user, context) => {
    const userRef = db.doc(`user/${user.uid}`);

    return userRef.update({
      name: user.displayName,
      createdAt: context.timestamp,
      nickname: slugify(user.displayName),
    });
  });
