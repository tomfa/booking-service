// eslint-disable-next-line import/no-extraneous-dependencies
import * as jwt from 'jsonwebtoken';
import BookingAPI from './API';
import { Booking, CreateBookingArgs, Resource, Schedule } from './types';
import { openingHourGenerator } from './utils.internal';
import { ErrorCode, ObjectDoesNotExist } from './errors';

const getOpenHours = openingHourGenerator({
  slotDuration: 60,
  slotInterval: 30,
});

const dummySchedule: Schedule = {
  mon: getOpenHours({ start: '08:00', end: '20:00' }),
  tue: getOpenHours({ start: '08:00', end: '20:00' }),
  wed: getOpenHours({ start: '08:00', end: '20:00' }),
  thu: getOpenHours({ start: '08:00', end: '20:00' }),
  fri: getOpenHours({ start: '08:00', end: '20:00' }),
  sat: getOpenHours({ start: '10:00', end: '16:00' }),
  sun: getOpenHours({ start: '10:00', end: '16:00' }),
  overriddenDates: {
    '2021-08-15': getOpenHours({ start: '12:00', end: '00:00' }),
    '2021-09-01': getOpenHours({ start: '06:00', end: '14:00' }),
    '2021-10-01': 'closed',
  },
};

const dummyResourceId = 'test-dummy-resource';
const customerId = 'test-dummy-user';

const dummyResource: Omit<Resource, 'id'> = {
  category: '',
  label: 'Dummy resource',
  seats: 12,
  enabled: true,
  schedule: dummySchedule,
};

const dummyBookingInput: CreateBookingArgs = {
  userId: 'external-user-id',
  resourceId: dummyResourceId,
  start: new Date('2021-05-08T13:30:00Z'),
};

const dummyBooking: Omit<Booking, 'id' | 'seatNumber'> = {
  ...dummyBookingInput,
  end: new Date('2021-05-08T14:30:00Z'),
  durationMinutes: 60,
  canceled: false,
  comment: '',
};
const dummyResourceWithSchedule = dummyResource;

const addSeconds = (date: Date, numSeconds: number) =>
  new Date(date.getTime() + numSeconds * 1000); // ms are being stripped away

const getPublicPrivateKeyCombo = () => ({
  privateKey:
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    '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\n' +
    '-----END RSA PRIVATE KEY-----',
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAuz54y4ZRtoGJ8mSppASq\n' +
    'd0ASRFAhiWIb7HrSf9kmDo1yBepAB93ABArwqu6ALEBQ48Iac83A/PTnG3SAoVTZ\n' +
    'X2pW1edvFGqDFSeO/rzWAN+73t+BxSf0LsK1XmY77sKhYGHSNtwZgfQfZwR1Lwrg\n' +
    'r2LO1NTaGEs+Ngw1ijXS1tofiV255ZrDTmzTtA9t+mjO+neQtCoC3xCxUnQ5Z8nB\n' +
    'g1YDJ8VMDV9jYc4sx0Yx1wZC1YIWGxteB0E2pnhO8BwPW1FuPuwvfGm7BCmq9WVX\n' +
    'Lb8WniBI0gqA5d7RW0tqg71tYqWvKDlTDJHuwhczs7NG5F01OxH3sV+IqdaDcTpr\n' +
    'sIsbqXsbXy9GOZxKcpT2omQKljYUgDiTBH3kywTUHobb7Gba59ydQ98IB3TyJL2a\n' +
    'BURWh79SoKixxd8wFXucQ5gmgM0pPkqvatKfBCf/c6K0k3AzyAw1MOYYT7TP6AXe\n' +
    '5n5xN+UZn3W6PskSYZ0p3HQcRrH8UCy8DJat5kUG6EsrDJq8p8SzqaO5tfQ62GK+\n' +
    '2qgaR5fAHZmQER5oMPQ4Ni8Z8v1ewl5WKKTDfHwQ0kovh+TnnEhtPVNgscPxy8q+\n' +
    '53xND7yf9CH/1DUAU48zkTtJZHwOakwKAuugMfP98iqAuBiCGyKGNn61ZS9X0H9S\n' +
    'wwqpdFa/zl9WtvvKjflTu0MCAwEAAQ==\n' +
    '-----END PUBLIC KEY-----',
});
const generateTemporaryToken = ({
  key,
  issuer,
  sub,
  permissions = ['vailable:api:*'],
}: {
  issuer: string;
  key: string;
  sub: string;
  permissions?: string[];
}) => {
  const payload = {
    iss: issuer,
    aud: [
      'api.vailable.eu',
      'http://localhost:8000',
      'http://localhost:5000',
      'https://vailable.eu',
    ],
    sub,
    permissions,
    role: 'user',
  };
  return jwt.sign(payload, key, { algorithm: 'RS256', expiresIn: '1 hour' });
};

describe('BookingAPI', () => {
  const rootToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkudmFpbGFibGUuZXUiLCJhdWQiOlsiYXBpLnZhaWxhYmxlLmV1IiwiaHR0cDovL2xvY2FsaG9zdDo4MDAwIiwiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiaHR0cHM6Ly92YWlsYWJsZS5ldSJdLCJzdWIiOiJ0b21hcyIsInBlcm1pc3Npb25zIjpbInZhaWxhYmxlOmFwaToqIl0sInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjI1NDM5MjA3LCJleHAiOjE2MjgxMTc2MDd9.NWaNrs3QKwotIpaIqJYkV07yGhQbxlQ7oUeu7x1Tr6w';
  const api: BookingAPI = new BookingAPI({
    baseUrl: process.env.GRAPHQL_URL,
  });
  let booking: Booking;
  let resource: Resource;

  const testSetup = async () => {
    const issuer = 'test-issuer-a1';
    const keys = getPublicPrivateKeyCombo();
    api.setToken(rootToken);
    try {
      await api.client.deleteCustomer({ id: customerId });
    } catch (err) {
      // That's OK
    }
    await api.client.addCustomer({
      addCustomerInput: {
        id: customerId,
        email: customerId + '@6040.work',
        publicKeys: [keys.publicKey],
        issuer,
      },
    });
    const token = generateTemporaryToken({
      key: keys.privateKey,
      issuer,
      sub: 'tomas',
    });
    api.setToken(token);
    resource = await api.addResource(
      dummyResourceWithSchedule,
      dummyResourceId
    );
    booking = await api.addBooking(dummyBookingInput);
  };
  const resetTestResource = async () => {
    await api.updateResource(dummyResourceId, dummyResourceWithSchedule);
  };
  const resetTestBooking = async () => {
    await api.cancelBooking(booking.id);
    booking = await api.addBooking(dummyBookingInput);
  };

  beforeAll(async () => {
    await testSetup();
  });

  describe('getResource', () => {
    it('returns resource', async () => {
      const response = await api.getResource(resource.id);
      expect(response).toEqual(resource);
    });
    it('throws ObjectDoesNotExist if resource does not exist', async () => {
      await expect(api.getResource('invalid-id')).rejects.toThrow(
        new ObjectDoesNotExist(
          'Resource invalid-id not found',
          ErrorCode.RESOURCE_DOES_NOT_EXIST
        )
      );
    });
  });
  describe('addResource', () => {
    it('adds a new resource with a random id', async () => {
      const newResource = {
        ...dummyResourceWithSchedule,
        label: 'A new resource',
      };

      const response = await api.addResource(newResource);

      expect(response).toEqual(
        expect.objectContaining({ ...dummyResource, label: 'A new resource' })
      );
      expect(response.id).toBeTruthy();
    });
    it('can optionally have id specified by caller', async () => {
      const newResource = {
        ...dummyResourceWithSchedule,
        label: 'A new resource',
      };
      const predeterminedId = 'cheesedoodles';

      const response = await api.addResource(newResource, predeterminedId);

      expect(response).toEqual(expect.objectContaining(newResource));
      expect(response.id).toBe(predeterminedId);
    });
    it('can optionally have category specified by caller', async () => {
      const newResource = {
        ...dummyResourceWithSchedule,
        label: 'MeetingRoom A',
        category: 'meeting-room',
      };

      const response = await api.addResource(newResource);

      expect(response).toEqual(expect.objectContaining(newResource));
      expect(response.category).toBe('meeting-room');
    });
  });
  describe('updateResource', () => {
    afterEach(resetTestResource);
    it('updates the resource', async () => {
      expect((await api.getResource(dummyResourceId)).enabled).toBe(true);

      const response = await api.updateResource(dummyResourceId, {
        enabled: false,
      });

      expect(response).toEqual(
        expect.objectContaining({ ...dummyResource, enabled: false })
      );
      expect((await api.getResource(dummyResourceId)).enabled).toBe(false);
    });
  });
  describe('deleteResource', () => {
    afterAll(resetTestResource);
    it('deletes the resource', async () => {
      expect(await api.getResource(dummyResourceId)).toBeTruthy();

      await api.deleteResource(dummyResourceId);
      const disabledResource = await api.getResource(dummyResourceId);
      expect(disabledResource.enabled).toBe(false);
    });
    it('throws ObjectDoesNotExist if no resource found', async () => {
      await expect(api.deleteResource('non-existing-id')).rejects.toThrow();
      // await expect(api.deleteResource('non-existing-id')).rejects.toThrow(
      //   new ObjectDoesNotExist(
      //     'Resource non-existing-id not found',
      //     ErrorCode.RESOURCE_DOES_NOT_EXIST
      //   )
      // );
    });
  });
  describe('findResources', () => {
    let roomResourceA;
    let roomResourceB;
    let deskResource;
    beforeAll(async () => {
      roomResourceA = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'Room A',
        category: 'room',
      });
      roomResourceB = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'Room B',
        category: 'room',
      });
      deskResource = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'Desk B',
        category: 'desk',
      });
    });
    it('returns a list of matching resources', async () => {
      const resources = await api.findResources({ label: dummyResource.label });
      expect(resources.length).toBe(1);
      expect(resources[0]).toEqual({ ...dummyResource, id: dummyResourceId });
    });
    it('returns empty list if no matches', async () => {
      const resources = await api.findResources({ label: 'No matchy' });
      expect(resources.length).toBe(0);
    });
    it('returns all resources if no filter is passed', async () => {
      const resources = await api.findResources();
      expect(resources.length).toBe(1);
      expect(resources[0]).toEqual({ ...dummyResource, id: dummyResourceId });
    });
    it('returns all resources matching category if category specified', async () => {
      const rooms = await api.findResources({ category: 'room' });
      const desks = await api.findResources({ category: 'desk' });

      expect(rooms.length).toBe(2);
      expect(rooms.find(r => r.label === roomResourceA.label)).toEqual(
        expect.objectContaining(roomResourceA)
      );
      expect(rooms.find(r => r.label === roomResourceB.label)).toEqual(
        expect.objectContaining(roomResourceB)
      );
      expect(desks.length).toBe(1);
      expect(desks.map(r => r.label)).toEqual([deskResource.label]);
    });
  });
  describe.skip('getNextAvailable', () => {
    afterEach(resetTestResource);
    it('returns first available slot after now', async () => {
      const now = new Date('2021-05-17T00:00:00Z');

      const slot = await api.getNextAvailable(resource.id, now);

      expect(slot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
    });
    it('includes start time now', async () => {
      const now = new Date('2021-05-17T08:00:00Z');

      const slot = await api.getNextAvailable(resource.id, now);

      expect(slot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
    });
    it('checks next day(s) if no available on current day', async () => {
      const newOpeningHours: Schedule = { ...dummySchedule, mon: 'closed' };
      await api.updateResource(resource.id, { schedule: newOpeningHours });

      const aMonday = new Date('2021-05-17T00:00:00Z');

      const slot = await api.getNextAvailable(resource.id, aMonday);

      expect(slot).toBeTruthy();
      expect(slot.start).toEqual(new Date('2021-05-18T08:00:00Z'));
    });
    it('does not return slot if seats are booked', async () => {
      await api.updateResource(resource.id, { seats: 1 });
      const beforeOpen = new Date('2021-05-17T00:00:00Z');
      const beforeSlot = await api.getNextAvailable(resource.id, beforeOpen);
      expect(beforeSlot.start).toEqual(new Date('2021-05-17T08:00:00Z'));

      await api.addBooking({
        ...dummyBookingInput,
        start: beforeSlot.start,
      });
      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      expect(slot.start).toEqual(new Date('2021-05-17T09:00:00Z'));
    });
    it('returns number of seats available', async () => {
      await api.updateResource(resource.id, { seats: 2 });
      await api.addBooking({
        ...dummyBookingInput,
        start: new Date('2021-05-17T08:00:00Z'),
      });
      await api.addBooking({
        ...dummyBookingInput,
        start: new Date('2021-05-17T08:30:00Z'),
      });

      const beforeOpen = new Date('2021-05-17T00:00:00Z');
      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      // Because available 08:00 -> 08:30 is not long enough for 60min slot.
      expect(slot.start).toEqual(new Date('2021-05-17T09:00:00Z'));
      expect(slot.availableSeats).toBe(1);
    });
    it('ignores canceled bookings', async () => {
      await api.updateResource(resource.id, { seats: 1 });
      await api.cancelBooking(booking.id);

      const beforeOpen = new Date('2021-05-17T00:00:00Z');
      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      expect(slot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
      expect(slot.availableSeats).toBe(1);
    });
    it('returns undefined if unable to find open slot', async () => {
      const alwaysClosedHours: Schedule = {
        ...dummySchedule,
        mon: 'closed',
        tue: 'closed',
        wed: 'closed',
        thu: 'closed',
        fri: 'closed',
        sat: 'closed',
        sun: 'closed',
        overriddenDates: {},
      };
      await api.updateResource(resource.id, { schedule: alwaysClosedHours });

      const now = new Date('2021-05-17T00:00:00Z');

      const slot = await api.getNextAvailable(resource.id, now);

      expect(slot).toBe(undefined);
    });
  });
  describe.skip('findAvailability', () => {
    afterEach(resetTestResource);
    it('returns bookable timeslots ordered by start time', async () => {
      const from = new Date('2021-05-17T00:00:00Z'); // Open from 08 to 20
      const to = new Date('2021-05-18T00:00:00Z');

      const slots = await api.findAvailability({
        resourceId: resource.id,
        from,
        to,
      });

      expect(slots.length).toEqual(12 * 2);
      const firstSlot = slots[0];
      const lastSlot = slots[slots.length - 1];
      expect(firstSlot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
      expect(firstSlot.end).toEqual(new Date('2021-05-17T09:00:00Z'));
      expect(firstSlot.availableSeats).toEqual(12);

      // Note 1: Slot starting at closing time (20:00) is not considered available.
      expect(lastSlot.start).toEqual(new Date('2021-05-17T19:30:00Z'));

      // Note 2: Duration may go outside of opening hours, e.g. for ceramic oven lasting 16 hours
      expect(lastSlot.end).toEqual(new Date('2021-05-17T20:30:00Z'));
      expect(lastSlot.availableSeats).toEqual(12);
    });
    it('returns timeslots with availableSeats=0 if fully booked', async () => {
      await api.updateResource(resource.id, { seats: 1 });
      await api.addBooking({
        ...dummyBookingInput,
        start: new Date('2021-05-17T08:00:00Z'),
      });
      const from = new Date('2021-05-17T00:00:00Z'); // Open from 08 to 20
      const to = new Date('2021-05-17T09:30:00Z');

      const slots = await api.findAvailability({
        resourceId: resource.id,
        from,
        to,
      });

      expect(
        slots.map(({ availableSeats, start, end }) => ({
          availableSeats,
          start: start.toISOString(),
          end: end.toISOString(),
        }))
      ).toEqual([
        {
          availableSeats: 0,
          start: '2021-05-17T08:00:00.000Z',
          end: '2021-05-17T09:00:00.000Z',
        },
        {
          availableSeats: 0,
          start: '2021-05-17T08:30:00.000Z',
          end: '2021-05-17T09:30:00.000Z',
        },
        {
          availableSeats: 1,
          start: '2021-05-17T09:00:00.000Z',
          end: '2021-05-17T10:00:00.000Z',
        },
      ]);
    });
    it('considers overridden opening hours for that day', async () => {
      await api.updateResource(resource.id, {
        ...dummyResource,
        schedule: {
          ...dummySchedule,
          overriddenDates: {
            '2021-05-17': {
              start: '13:00',
              end: '13:30',
              slotIntervalMinutes: 15,
              slotDurationMinutes: 30,
            },
          },
        },
      });

      const slots = await api.findAvailability({
        resourceId: resource.id,
        from: new Date('2021-05-17T00:00:00Z'),
        to: new Date('2021-05-18T00:00:00Z'),
      });

      expect(slots).toEqual([
        {
          availableSeats: 12,
          start: new Date('2021-05-17T13:00:00.000Z'),
          end: new Date('2021-05-17T13:30:00.000Z'),
        },
        {
          availableSeats: 12,
          start: new Date('2021-05-17T13:15:00.000Z'),
          end: new Date('2021-05-17T13:45:00.000Z'),
        },
      ]);
    });
    it('considers bookings from before timeframe than can overlap', async () => {
      const resourceOpen12To14 = await api.updateResource(resource.id, {
        ...dummyResource,
        seats: 1,
        schedule: {
          ...dummySchedule,
          overriddenDates: {
            '2021-05-17': {
              start: '12:00',
              end: '14:00',
              slotIntervalMinutes: 30,
              slotDurationMinutes: 120,
            },
          },
        },
      });

      const booking12To14: CreateBookingArgs = {
        userId: 'jonathan',
        resourceId: resourceOpen12To14.id,
        start: new Date('2021-05-17T12:00:00Z'),
      };
      await api.addBooking(booking12To14);

      const slots = await api.findAvailability({
        resourceId: resourceOpen12To14.id,
        from: new Date('2021-05-17T13:00:00Z'),
        to: new Date('2021-05-18T00:00:00Z'),
      });

      expect(slots).toEqual([
        {
          availableSeats: 0,
          start: new Date('2021-05-17T13:00:00.000Z'),
          end: new Date('2021-05-17T15:00:00.000Z'),
        },
        {
          availableSeats: 0,
          start: new Date('2021-05-17T13:30:00.000Z'),
          end: new Date('2021-05-17T15:30:00.000Z'),
        },
      ]);
    });
  });
  describe('getBooking', () => {
    it('returns booking', async () => {
      const response = await api.getBooking(booking.id);
      expect(response).toEqual(booking);
    });
    it('throws ObjectDoesNotExist if resource does not exist', async () => {
      await expect(api.getBooking('invalid-id')).rejects.toThrow(
        new ObjectDoesNotExist(
          'Booking invalid-id does not exist',
          ErrorCode.BOOKING_DOES_NOT_EXIST
        )
      );
    });
  });
  describe('addBooking', () => {
    afterEach(async () => {
      await Promise.all([resetTestResource(), resetTestBooking()]);
    });
    it('returns new booking', async () => {
      const response = await api.addBooking(dummyBookingInput);

      expect(response).toEqual({
        ...booking,
        id: response.id,
        seatNumber: booking.seatNumber + 1,
      });
      expect(response.id).not.toEqual(booking.id);
    });
    it('increments seatNumber from 0 to Resource.seats', async () => {
      expect(booking.seatNumber).toBe(0);
      const secondBooking = await api.addBooking(dummyBookingInput);
      const thirdBooking = await api.addBooking(dummyBookingInput);
      expect(secondBooking.seatNumber).toBe(1);
      expect(thirdBooking.seatNumber).toBe(2);
    });
    it('sets duration to equal resource.slotDuration', async () => {
      const response = await api.addBooking(dummyBookingInput);

      expect(response.durationMinutes).toEqual(60);
      expect(response.end).toEqual(
        new Date(dummyBookingInput.start.getTime() + 60 * 60 * 1000)
      );
      expect(response.id).not.toEqual(booking.id);
    });
    it('stores optional comment argument, or sets to empty string', async () => {
      const bookingWithoutcomment = await api.addBooking(dummyBookingInput);
      const bookingWithcomment = await api.addBooking({
        ...dummyBookingInput,
        comment: 'Cheese please',
      });

      expect(bookingWithoutcomment.comment).toEqual('');
      expect(bookingWithcomment.comment).toEqual('Cheese please');
    });
    it('throws ObjectDoesNotExist if resource id is unknown', async () => {
      const invalidBooking = { ...dummyBookingInput, resourceId: 'unknown-id' };

      await expect(api.addBooking(invalidBooking)).rejects.toThrow();
      //   new ObjectDoesNotExist(
      //     'Can not create booking on unknown resource',
      //     ErrorCode.RESOURCE_DOES_NOT_EXIST
      //   )
      // );
    });
    it('throws BadRequestError if resource is disabled', async () => {
      await api.updateResource(resource.id, { enabled: false });

      await expect(
        api.addBooking({
          start: booking.start,
          resourceId: booking.resourceId,
          userId: booking.userId,
        })
      ).rejects.toThrow();
      //   new BadRequestError(
      //     `Unable to add booking to disabled resource ${resource.id}`,
      //     ErrorCode.RESOURCE_IS_DISABLED
      //   )
      // );
    });
    it('throws BadRequestError if resource has no slots left', async () => {
      await api.updateResource(resource.id, { seats: 1 });
      const bookingInput = {
        start: booking.start,
        resourceId: booking.resourceId,
        userId: booking.userId,
      };

      await expect(api.addBooking(bookingInput)).rejects.toThrow();
      //   new BadRequestError(
      //     `No available slots in requested period for resource ${resource.id}`,
      //     ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
      //   )
      // );

      // Check that it considers cancelled booking an open slot
      await api.cancelBooking(booking.id);
      await api.addBooking(bookingInput);
    });
    it('throws BadRequestError if resource is closed at requested time', async () => {
      const mondayAtMidnightUTC = new Date('2021-05-17T00:00:00Z');

      const invalidBookingPayload: CreateBookingArgs = {
        ...dummyBookingInput,
        start: mondayAtMidnightUTC,
      };

      await expect(api.addBooking(invalidBookingPayload)).rejects.toThrow();
      //   new BadRequestError(
      //     `Booked time ${mondayAtMidnightUTC.toISOString()} does not fit into resource ${resource.id} time slots`,
      //     ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
      //   )
      // );
    });
    it('throws BadRequestError if booking hour does not match slot for resource', async () => {
      const validMondayHour = new Date('2021-05-17T13:00:00Z');
      const addToValidHour = (minutes: number) =>
        new Date(validMondayHour.getTime() + minutes * 60 * 1000);

      const validBookingPayload: CreateBookingArgs = {
        resourceId: booking.resourceId,
        userId: booking.resourceId,
        start: validMondayHour,
        end: addToValidHour(60),
      };
      await api.addBooking(validBookingPayload);

      const invalidBooking = {
        ...validBookingPayload,
        start: addToValidHour(1),
        end: addToValidHour(61),
      };
      await expect(api.addBooking(invalidBooking)).rejects.toThrow();
      //   new BadRequestError(
      //     `Booked time ${validMondayHour.toISOString()} does not fit into resource ${resource.id} time slots`,
      //     ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
      //   )
      // );
    });
  });
  describe('cancelBooking', () => {
    afterAll(resetTestBooking);
    it('changes canceled attribute to true', async () => {
      expect(booking.canceled).toBe(false);

      await api.cancelBooking(booking.id);

      expect((await api.getBooking(booking.id)).canceled).toBe(true);
    });
    it('throws ObjectDoesNotExist if booking does not exist', async () => {
      await expect(api.cancelBooking('does-not-exist')).rejects.toThrow();
      //   new ObjectDoesNotExist(
      //     `Booking does-not-exist does not exist`,
      //     ErrorCode.BOOKING_DOES_NOT_EXIST
      //   )
      // );
    });
  });
  describe('setBookingComment', () => {
    afterAll(resetTestBooking);
    it('updates comment', async () => {
      expect(booking.comment).toBe('');

      await api.setBookingComment(booking.id, 'hi-there');

      expect((await api.getBooking(booking.id)).comment).toBe('hi-there');
    });
    it('throws ObjectDoesNotExist if booking does not exist', async () => {
      await expect(
        api.setBookingComment('does-not-exist', 'hi-there')
      ).rejects.toThrow();
      //   new ObjectDoesNotExist(
      //     `Booking does-not-exist does not exist`,
      //     ErrorCode.BOOKING_DOES_NOT_EXIST
      //   )
      // );
    });
  });
  describe('findBookings', () => {
    afterEach(resetTestBooking);
    it('returns a list of bookings matching filter', async () => {
      const bookings = await api.findBookings({ resourceIds: [resource.id] });

      expect(bookings.length).toBe(1);
      expect(bookings[0]).toEqual(booking);
    });
    it('returns empty list if no bookings matches filter', async () => {
      await api.cancelBooking(booking.id);
      const bookings = await api.findBookings({
        resourceIds: [resource.id],
      });

      expect(bookings.length).toBe(0);
    });
    it('returns all bookings if resourceId filter is empty list', async () => {
      const bookings = await api.findBookings({ resourceIds: [] });

      expect(bookings.length).toBe(1);
    });
    it('excludes bookings with resourceId different than specified', async () => {
      const bookings = await api.findBookings({
        resourceIds: ['different-resource-id'],
      });

      expect(bookings.length).toBe(0);
    });

    it('returns all non-canceled bookings if filters are not specified', async () => {
      const newBooking = await api.addBooking({
        start: booking.start,
        resourceId: booking.resourceId,
        userId: booking.userId,
      });
      await api.cancelBooking(newBooking.id);

      const bookings = await api.findBookings();

      expect(bookings.length).toBe(1);
      expect(bookings[0]).toEqual(booking);
    });

    it('includes canceled bookings if includeCanceled is true', async () => {
      await api.cancelBooking(booking.id);

      const bookings = await api.findBookings({ includeCanceled: true });

      expect(bookings.length).toBe(1);
      expect(bookings[0].canceled).toBe(true);
    });
    it('excludes bookings with start < from filter', async () => {
      const bookings = await api.findBookings({
        from: addSeconds(booking.start, 1),
      });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with start == from filter', async () => {
      const bookings = await api.findBookings({ from: booking.start });

      expect(bookings.length).toBe(1);
    });
    it('includes bookings with start > from filter', async () => {
      const bookings = await api.findBookings({
        from: addSeconds(booking.start, -1),
      });

      expect(bookings.length).toBe(1);
    });

    it('excludes bookings with start > to filter', async () => {
      const bookings = await api.findBookings({
        to: addSeconds(booking.start, -1),
      });

      expect(bookings.length).toBe(0);
    });
    it('excludes bookings with start == to filter', async () => {
      const bookings = await api.findBookings({ to: booking.start });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with start < to filter', async () => {
      const bookings = await api.findBookings({
        to: addSeconds(booking.start, 1),
      });

      expect(bookings.length).toBe(1);
    });
    it('excludes bookings with userId != userId filter', async () => {
      const bookings = await api.findBookings({ userId: 'user-2' });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with userId == userId filter', async () => {
      const bookings = await api.findBookings({ userId: booking.userId });

      expect(bookings.length).toBe(1);
    });
    it('includes bookings with resource.category == category filter', async () => {
      const meetingRoom = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'MeetingRoom A',
        category: 'room',
      });
      const roomBooking = await api.addBooking({
        ...dummyBookingInput,
        resourceId: meetingRoom.id,
      });

      const bookings = await api.findBookings();
      const roomBookings = await api.findBookings({
        resourceCategories: ['room'],
      });

      expect(bookings.length).toBe(2);
      expect(roomBookings.length).toBe(1);
      expect(roomBookings[0].resourceId).toBe(meetingRoom.id);
      expect(roomBookings[0].id).toBe(roomBooking.id);
    });
  });
  describe.skip('getLatestBooking', () => {
    const oldBooking = {
      ...dummyBookingInput,
      start: new Date(dummyBooking.start.getTime() - 30 * 60 * 1000),
    };
    const newBooking = {
      ...dummyBookingInput,
      start: new Date(dummyBooking.start.getTime() + 30 * 60 * 1000),
    };
    it('returns booking with latest start time', async () => {
      await api.addBooking(newBooking);
      await api.addBooking(oldBooking);

      const latestBooking = await api.getLatestBooking({
        resourceIds: [dummyBookingInput.resourceId],
      });

      expect(latestBooking).toEqual(expect.objectContaining(newBooking));
    });
    it('filters by resourceId if specified', async () => {
      const differentResource = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'New resource',
      });
      await api.addBooking(newBooking);
      const oldBookingWithMatchingResource = await api.addBooking({
        ...oldBooking,
        resourceId: differentResource.id,
      });

      const latestBooking = await api.getLatestBooking({
        resourceIds: [differentResource.id],
      });

      expect(latestBooking).toEqual(oldBookingWithMatchingResource);
    });
    it('returns undefined if no booking exists matching filter', async () => {
      const latestBooking = await api.getLatestBooking({
        userId: 'new-user-without-bookings-id',
      });

      expect(latestBooking).toBe(undefined);
    });
  });
  describe('getBookedDuration', () => {
    it('returns minutes booked, number of bookings, booking ids', async () => {
      const {
        numBookings,
        bookingIds,
        minutes,
      } = await api.getBookedDuration();

      expect(numBookings).toBe(1);
      expect(bookingIds).toEqual([booking.id]);
      expect(minutes).toBe(60);
    });
    it('can have result filtered by userId, resourceId or from/to', async () => {
      const matchingUserId = await api.getBookedDuration({
        userId: booking.userId,
      });
      const matchingResourceId = await api.getBookedDuration({
        resourceIds: [booking.resourceId],
      });
      const differentUserId = await api.getBookedDuration({
        userId: 'different-user-id',
      });
      const differentResourceId = await api.getBookedDuration({
        resourceIds: ['different-resource-id'],
      });
      const periodAfter = await api.getBookedDuration({
        from: booking.end,
      });
      const periodBefore = await api.getBookedDuration({
        to: booking.start,
      });
      // Note: does NOT include booking that started before "from", but ends after
      const periodStartingJustBefore = await api.getBookedDuration({
        from: addSeconds(booking.start, 1),
      });
      // Note: DOES include booking ends after "to", but starts before
      const periodEndingJustAfter = await api.getBookedDuration({
        to: addSeconds(booking.end, -1),
      });

      expect(matchingUserId.numBookings).toEqual(1);
      expect(differentUserId.numBookings).toEqual(0);
      expect(matchingResourceId.numBookings).toEqual(1);
      expect(differentResourceId.numBookings).toEqual(0);
      expect(periodAfter.numBookings).toEqual(0);
      expect(periodBefore.numBookings).toEqual(0);
      expect(periodStartingJustBefore.numBookings).toEqual(0);
      expect(periodEndingJustAfter.numBookings).toEqual(1);
    });
  });
});
