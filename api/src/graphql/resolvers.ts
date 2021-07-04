import * as admin from 'firebase-admin';

export const resolvers = {
  Query: {
    customers: async () => {
      const users = await admin.firestore().collection('users').get();

      return users.docs.map(user => user.data());
    },
  },
};
