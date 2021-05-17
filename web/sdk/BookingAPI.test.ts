import BookingAPI from './BookingAPI.mock';
import { Booking, Resource, Schedule } from './BookingAPI.types';
import { openingHourGenerator } from './utils';
import {
  BadRequestError,
  ConflictingObjectExists,
  ObjectDoesNotExist,
} from './errors';

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
    '2021-10-01': getOpenHours({ start: '00:00', end: '00:00' }), // closed
  },
};

const dummyResourceId = 'dummy-resource';
const dummyResource: Omit<Resource, 'id'> = {
  label: 'Dummy resource',
  schedule: dummySchedule,
  seats: 12,
  enabled: true,
};

const dummyBooking: Omit<Booking, 'id'> = {
  userId: 'external-user-id',
  resourceId: dummyResourceId,
  start: new Date('2021-05-08T13:30'),
  end: new Date('2021-05-08T14:30'),
  canceled: false,
};

describe('BookingAPI', () => {
  let api: BookingAPI = new BookingAPI({ apiKey: 'dummy-key' });
  let booking: Booking;
  let resource: Resource;

  beforeEach(async () => {
    api = new BookingAPI({ apiKey: 'dummy-key' });
    resource = await api.addResource(dummyResource, dummyResourceId);
    booking = await api.addBooking(dummyBooking);
  });

  describe('getResource', () => {
    it('returns resource', async () => {
      const response = await api.getResource(resource.id);
      expect(response).toBe(resource);
    });
    it('throws ObjectDoesNotExist if resource does not exist', async () => {
      await expect(api.getResource('invalid-id')).rejects.toThrow(
        ObjectDoesNotExist
      );
    });
  });
  describe('addResource', () => {
    it('adds a new resource with a random id', async () => {
      const newResource = { ...dummyResource, label: 'A new resource' };

      const response = await api.addResource(newResource);

      expect(response).toEqual(expect.objectContaining(newResource));
      expect(response.id).toBeTruthy();
    });
    it('can optionally have id specified by caller', async () => {
      const newResource = { ...dummyResource, label: 'A new resource' };
      const predeterminedId = 'cheesedoodles';

      const response = await api.addResource(newResource, predeterminedId);

      expect(response).toEqual(expect.objectContaining(newResource));
      expect(response.id).toBe(predeterminedId);
    });
    it('throws ConflictingObjectExists if label is already taken', async () => {
      const newResource = { ...dummyResource, label: dummyResource.label };

      await expect(api.addResource(newResource)).rejects.toThrow(
        ConflictingObjectExists
      );
    });
  });
  describe('updateResource', () => {
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
    it('throws BadRequestError if attempting to update the id', async () => {
      await expect(
        api.updateResource(dummyResourceId, { id: 'newId' })
      ).rejects.toThrow(BadRequestError);
    });
  });
  describe('deleteResource', () => {
    it('deletes the resource', async () => {
      expect(await api.getResource(dummyResourceId)).toBeTruthy();

      await api.deleteResource(dummyResourceId);

      await expect(api.getResource(dummyResourceId)).rejects.toThrow(
        ObjectDoesNotExist
      );
    });
    it('throws ObjectDoesNotExist if no resource found', async () => {
      await expect(api.deleteResource('non-existing-id')).rejects.toThrow(
        ObjectDoesNotExist
      );
    });
  });
  describe('findResources', () => {
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
  });
  describe('getNextAvailable', () => {
    it('returns first available slot after now', async () => {
      const now = new Date('2021-05-17T00:00:00Z');

      const slot = await api.getNextAvailable(resource.id, now);

      expect(slot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
    });
  });
  describe.skip('findAvailability', () => {
    it('works', async () => {
      const response = true; // await api.findAvailability();
      expect(response).toBe(true);
    });
  });
  describe('getBooking', () => {
    it('returns booking', async () => {
      const response = await api.getBooking(booking.id);
      expect(response).toBe(booking);
    });
    it('throws ObjectDoesNotExist if resource does not exist', async () => {
      await expect(api.getBooking('invalid-id')).rejects.toThrow(
        ObjectDoesNotExist
      );
    });
  });
  describe('addBooking', () => {
    it('returns new booking', async () => {
      const response = await api.addBooking({ ...booking });

      expect(response).toEqual({ ...booking, id: response.id });
      expect(response.id).not.toEqual(booking.id);
    });
    it('throws ObjectDoesNotExist if resource id is unknown', async () => {
      const invalidBooking = { ...booking, resourceId: 'unknown-id' };

      await expect(api.addBooking(invalidBooking)).rejects.toThrow(
        ObjectDoesNotExist
      );
    });
    it('throws BadRequestError if resource is disabled', async () => {
      await api.updateResource(resource.id, { enabled: false });

      await expect(api.addBooking({ ...booking })).rejects.toThrow(
        new BadRequestError(
          `Unable to add booking to disabled resource ${resource.id}`
        )
      );
    });
    it('throws BadRequestError if resource has no slots left', async () => {
      await api.updateResource(resource.id, { seats: 1 });

      await expect(api.addBooking({ ...booking })).rejects.toThrow(
        new BadRequestError(
          `No available slots in requested period for resource ${resource.id}`
        )
      );

      // Check that it considers cancelled booking an open slot
      await api.cancelBooking(booking.id);
      await api.addBooking({ ...booking });
    });
    it('throws BadRequestError if resource is closed at requested time', async () => {
      const mondayAtMidnightUTC = new Date('2021-05-17T00:00:00Z');
      const oneHourLater = new Date(
        mondayAtMidnightUTC.getTime() + 3600 * 1000
      );

      const invalidBookingPayload: Booking = {
        ...booking,
        start: mondayAtMidnightUTC,
        end: oneHourLater,
      };

      await expect(api.addBooking(invalidBookingPayload)).rejects.toThrow(
        new BadRequestError(
          `Resource ${resource.id} is not open at requested time`
        )
      );
    });
    it('throws BadRequestError if booking hour does not match slot for resource', async () => {
      const validMondayHour = new Date('2021-05-17T13:00:00Z');
      const addToValidHour = (minutes: number) =>
        new Date(validMondayHour.getTime() + minutes * 60 * 1000);

      const validBookingPayload: Booking = {
        ...booking,
        start: validMondayHour,
        end: addToValidHour(60),
      };
      await api.addBooking(validBookingPayload);

      const invalidBooking = {
        ...validBookingPayload,
        start: addToValidHour(1),
        end: addToValidHour(61),
      };
      await expect(api.addBooking(invalidBooking)).rejects.toThrow(
        new BadRequestError(
          `Booked time 2021-05-17T13:01:00.000Z does not fit into resource ${resource.id} time slots`
        )
      );
    });
  });
  describe('cancelBooking', () => {
    it('changes canceled attribute to true', async () => {
      expect(booking.canceled).toBe(false);

      await api.cancelBooking(booking.id);

      expect((await api.getBooking(booking.id)).canceled).toBe(true);
    });
    it('throws ObjectDoesNotExist if booking does not exist', async () => {
      await expect(api.cancelBooking('does-not-exist')).rejects.toThrow(
        ObjectDoesNotExist
      );
    });
  });
  describe.skip('findsBookings', () => {
    it('works', async () => {
      const response = true; // await api.findsBookings();
      expect(response).toBe(true);
    });
  });
  describe.skip('getLatestBooking', () => {
    it('works', async () => {
      const response = true; // await api.getLatestBooking();
      expect(response).toBe(true);
    });
  });
  describe.skip('getBookedDuration', () => {
    it('works', async () => {
      const response = true; // await api.getBookedDuration();
      expect(response).toBe(true);
    });
  });
});
