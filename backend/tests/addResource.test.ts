import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import {
  AddResourceMutationVariables,
  Resource,
} from '../graphql/generated/types';
// import { getDB } from '../localDb';
import { client } from './client';

describe('addResource', () => {
  it('should not signup a user with a password less than 8 characters', async () => {
    // const db = await getDB()
    const addResource = gql`
      mutation {
        addResource(
          addResourceInput: {
            enabled: true
            label: "Chermics"
            seats: 20
            schedule: [
              {
                slotDurationMinutes: 30
                slotIntervalMinutes: 15
                day: "mon"
                start: "08:00"
                end: "16:00"
              }
            ]
          }
        ) {
          id
          label
        }
      }
    `;

    const res = await client.mutate<Resource, AddResourceMutationVariables>({
      mutation: addResource,
    });
    console.log(res);
    expect(res).toEqual({ hei: 1 });

    // await expect(
    //   client.mutate({
    //     mutation: createUser,
    //   })
    // ).rejects.toThrowError('password must be more than 8 characters');
  });
});
