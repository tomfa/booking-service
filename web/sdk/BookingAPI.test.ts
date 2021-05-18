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
    it('includes start time now', async () => {
      const now = new Date('2021-05-17T08:00:00Z');

      const slot = await api.getNextAvailable(resource.id, now);

      expect(slot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
    });
    it('checks next day(s) if no available on current day', async () => {
      const closed = getOpenHours({ start: '00:00', end: '00:00' });
      const newOpeningHours: Schedule = { ...dummySchedule, mon: closed };
      await api.updateResource(resource.id, { schedule: newOpeningHours });

      const beforeOpen = new Date('2021-05-17T00:00:00Z');

      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      expect(slot).toBeTruthy();
      expect(slot.start).toEqual(new Date('2021-05-18T08:00:00Z'));
    });
    it('does not return slot if seats are booked', async () => {
      await api.updateResource(resource.id, { seats: 1 });
      const beforeOpen = new Date('2021-05-17T00:00:00Z');
      const beforeSlot = await api.getNextAvailable(resource.id, beforeOpen);
      expect(beforeSlot.start).toEqual(new Date('2021-05-17T08:00:00Z'));

      await api.addBooking({
        ...dummyBooking,
        start: beforeSlot.start,
        end: beforeSlot.end,
      });
      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      expect(slot.start).toEqual(new Date('2021-05-17T09:00:00Z'));
    });
    it('returns number of seats available', async () => {
      await api.updateResource(resource.id, { seats: 2 });
      await api.addBooking({
        ...dummyBooking,
        start: new Date('2021-05-17T08:00:00Z'),
        end: new Date('2021-05-17T09:00:00Z'),
      });
      await api.addBooking({
        ...dummyBooking,
        start: new Date('2021-05-17T08:30:00Z'),
        end: new Date('2021-05-17T09:30:00Z'),
      });

      const beforeOpen = new Date('2021-05-17T00:00:00Z');
      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      // Because available 08:00 -> 08:30 is not long enough for 60min slot.
      expect(slot.start).toEqual(new Date('2021-05-17T09:00:00Z'));
      expect(slot.availableSeats).toBe(1);
    });
    it('ignores canceled bookings', async () => {
      await api.updateResource(resource.id, { seats: 1 });
      const newBooking = await api.addBooking({
        ...dummyBooking,
        start: new Date('2021-05-17T08:00:00Z'),
        end: new Date('2021-05-17T09:00:00Z'),
      });
      await api.cancelBooking(newBooking.id);

      const beforeOpen = new Date('2021-05-17T00:00:00Z');
      const slot = await api.getNextAvailable(resource.id, beforeOpen);

      expect(slot.start).toEqual(new Date('2021-05-17T08:00:00Z'));
      expect(slot.availableSeats).toBe(1);
    });
    it('returns undefined if unable to find open slot', async () => {
      const closed = getOpenHours({ start: '00:00', end: '00:00' });
      const alwaysClosedHours: Schedule = {
        ...dummySchedule,
        mon: closed,
        tue: closed,
        wed: closed,
        thu: closed,
        fri: closed,
        sat: closed,
        sun: closed,
        overriddenDates: {},
      };
      await api.updateResource(resource.id, { schedule: alwaysClosedHours });

      const now = new Date('2021-05-17T00:00:00Z');

      const slot = await api.getNextAvailable(resource.id, now);

      expect(slot).toBe(undefined);
    });
  });
  describe('findAvailability', () => {
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
        ...dummyBooking,
        start: new Date('2021-05-17T08:00:00Z'),
        end: new Date('2021-05-17T09:00:00Z'),
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
  describe('findsBookings', () => {
    it('returns a list of bookings matching filter', async () => {
      const bookings = await api.findsBookings({ resourceIds: [resource.id] });

      expect(bookings.length).toBe(1);
      expect(bookings[0]).toBe(booking);
    });
    it('returns empty list if no bookings matches filter', async () => {
      await api.cancelBooking(booking.id);
      const bookings = await api.findsBookings({
        resourceIds: [resource.id],
        includeCanceled: false,
      });

      expect(bookings.length).toBe(0);
    });
    it('returns empty list if resourceId filter is empty list', async () => {
      const bookings = await api.findsBookings({ resourceIds: [] });

      expect(bookings.length).toBe(0);
    });
    it('excludes bookings with resourceId different than specified', async () => {
      const bookings = await api.findsBookings({
        resourceIds: ['different-resource-id'],
      });

      expect(bookings.length).toBe(0);
    });

    it('returns all non-canceled bookings if filters are not specified', async () => {
      const newBooking = await api.addBooking({ ...booking });
      await api.cancelBooking(newBooking.id);

      const bookings = await api.findsBookings();

      expect(bookings.length).toBe(1);
      expect(bookings[0]).toBe(booking);
    });

    it('includes canceled bookings if includeCanceled is true', async () => {
      await api.cancelBooking(booking.id);

      const bookings = await api.findsBookings({ includeCanceled: true });

      expect(bookings.length).toBe(1);
      expect(bookings[0].canceled).toBe(true);
    });
    it('excludes bookings with start < from filter', async () => {
      const bookings = await api.findsBookings({
        from: new Date(booking.start.getTime() + 1),
      });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with start == from filter', async () => {
      const bookings = await api.findsBookings({ from: booking.start });

      expect(bookings.length).toBe(1);
    });
    it('includes bookings with start > from filter', async () => {
      const bookings = await api.findsBookings({
        from: new Date(booking.start.getTime() - 1),
      });

      expect(bookings.length).toBe(1);
    });

    it('excludes bookings with start > to filter', async () => {
      const bookings = await api.findsBookings({
        to: new Date(booking.start.getTime() - 1),
      });

      expect(bookings.length).toBe(0);
    });
    it('excludes bookings with start == to filter', async () => {
      const bookings = await api.findsBookings({ to: booking.start });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with start < to filter', async () => {
      const bookings = await api.findsBookings({
        to: new Date(booking.start.getTime() + 1),
      });

      expect(bookings.length).toBe(1);
    });
    it('excludes bookings with userId != userId filter', async () => {
      const bookings = await api.findsBookings({ userId: 'user-2' });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with userId == userId filter', async () => {
      const bookings = await api.findsBookings({ userId: booking.userId });

      expect(bookings.length).toBe(1);
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
