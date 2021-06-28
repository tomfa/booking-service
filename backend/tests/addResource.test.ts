import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import { mutate } from './client';
import { createCustomer } from './utils';

const createAddResourceMutation = (
  customerId: string,
  start: string,
  end: string
) => gql`
    mutation {
        addResource(
            addResourceInput: {
                customerId: "${customerId}",
                enabled: true
                label: "Chermics"
                seats: 20
                schedule: [
                    {
                        slotDurationMinutes: 30
                        slotIntervalMinutes: 15
                        day: "mon"
                        start: "${start}"
                        end: "${end}"
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

describe('addResource', () => {
  it('adds a new resource', async () => {
    const customer = await createCustomer();
    const addResource = createAddResourceMutation(
      customer.id,
      '08:00',
      '16:00'
    );

    const { data } = await mutate(addResource);
    expect(data?.addResource).toEqual({
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
    });
  });
  it('returns error if schedule start is invalid time', async () => {
    const customer = await createCustomer();
    const addResource = createAddResourceMutation(
      customer.id,
      '23:00',
      '25:00'
    );

    const { data, errors } = await mutate(addResource);
    expect(data?.addResource).toEqual(null);
    expect(errors?.length).toBe(1);
    const error = errors && errors[0];
    expect(error?.message).toEqual(
      `hourMinute '25:00': hours must be >= 0 and < 24`
    );
    expect(error?.extensions).toEqual({ code: 400, type: 'invalid_timestamp' });
  });
  it('returns error if schedule start is after end', async () => {
    const customer = await createCustomer();
    const addResource = createAddResourceMutation(
      customer.id,
      '23:00',
      '21:00'
    );

    const { data, errors } = await mutate(addResource);
    expect(data?.addResource).toEqual(null);
    expect(errors?.length).toBe(1);
    const error = errors && errors[0];
    expect(error?.message).toEqual(
      `Start time '23:00' is after end time '21:00'`
    );
    expect(error?.extensions).toEqual({ code: 400, type: 'invalid_timestamp' });
  });
});
