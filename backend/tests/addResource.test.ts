import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import {
  AddResourceMutationVariables,
  Resource,
} from '../graphql/generated/types';
import { client } from './client';
import { createCustomer } from './utils';

describe('addResource', () => {
  it('should not signup a user with a password less than 8 characters', async () => {
    const customer = await createCustomer();
    const addResource = gql`
      mutation {
        addResource(
          addResourceInput: {
            customerId: "${customer.id}",
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
          label
          seats
          schedule {
              mon {
                  start
                  end
                  slotDurationMinutes
                  slotIntervalMinutes
              }
              tue {
                  start
                  end
                  slotDurationMinutes
                  slotIntervalMinutes
              }
              
              overriddenDates {
                  isoDate
                  schedule {
                      slotDurationMinutes
                      slotIntervalMinutes
                      start
                      end
                  }
              }
          }
          enabled
          category
        }
      }
    `;

    const { data } = await client.mutate<
      { addResource: Resource },
      AddResourceMutationVariables
    >({
      mutation: addResource,
    });
    expect(data).toEqual({
      addResource: {
        label: 'Chermics',
        seats: 20,
        schedule: {
          mon: {
            start: '08:00',
            end: '16:00',
            slotDurationMinutes: 30,
            slotIntervalMinutes: 15,
            __typename: 'HourSchedule',
          },
          tue: {
            start: '',
            end: '',
            slotDurationMinutes: 0,
            slotIntervalMinutes: 0,
            __typename: 'HourSchedule',
          },
          overriddenDates: [],
          __typename: 'Schedule',
        },
        enabled: true,
        category: null,
        __typename: 'Resource',
      },
    });
  });
});
