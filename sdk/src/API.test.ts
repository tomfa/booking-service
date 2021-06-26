import BookingAPI from './API';
import { Booking, CreateBookingArgs, Resource, Schedule } from './types';
import { addMinutes, openingHourGenerator } from './utils.internal';
import {
  BadRequestError,
  ConflictingObjectExists,
  ErrorCode,
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
  category: '',
  label: 'Dummy resource',
  seats: 12,
  enabled: true,
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
const dummyResourceWithSchedule = { ...dummyResource, schedule: dummySchedule };

describe('BookingAPI', () => {
  let api: BookingAPI = new BookingAPI({ token: 'dummy-key' });
  let booking: Booking;
  let resource: Resource;

  beforeEach(async () => {
    api = new BookingAPI({ token: 'dummy-key' });
    resource = await api.addResource(
      dummyResourceWithSchedule,
      dummyResourceId
    );
    booking = await api.addBooking(dummyBookingInput);
  });

  describe('getResource', () => {
    it('returns resource', async () => {
      const response = await api.getResource(resource.id);
      expect(response).toBe(resource);
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

      expect(response).toEqual(expect.objectContaining(newResource));
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
    it('throws ConflictingObjectExists if label is already taken', async () => {
      const newResource = {
        ...dummyResourceWithSchedule,
        label: dummyResource.label,
      };

      await expect(api.addResource(newResource)).rejects.toThrow(
        new ConflictingObjectExists(
          'Resource with label Dummy resource already exists',
          ErrorCode.CONFLICTS_WITH_EXISTING_RESOURCE
        )
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
  });
  describe('deleteResource', () => {
    it('deletes the resource', async () => {
      expect(await api.getResource(dummyResourceId)).toBeTruthy();

      await api.deleteResource(dummyResourceId);

      await expect(api.getResource(dummyResourceId)).rejects.toThrow(
        new ObjectDoesNotExist(
          'Resource dummy-resource not found',
          ErrorCode.RESOURCE_DOES_NOT_EXIST
        )
      );
    });
    it('throws ObjectDoesNotExist if no resource found', async () => {
      await expect(api.deleteResource('non-existing-id')).rejects.toThrow(
        new ObjectDoesNotExist(
          'Resource non-existing-id not found',
          ErrorCode.RESOURCE_DOES_NOT_EXIST
        )
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
    it('returns all resources matching category if category specified', async () => {
      const roomResourceA = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'Room A',
        category: 'room',
      });
      const roomResourceB = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'Room B',
        category: 'room',
      });
      const deskResource = await api.addResource({
        ...dummyResourceWithSchedule,
        label: 'Desk B',
        category: 'desk',
      });

      const rooms = await api.findResources({ category: 'room' });
      const desks = await api.findResources({ category: 'desk' });

      expect(rooms.length).toBe(2);
      expect(rooms.map(r => r.label)).toEqual([
        roomResourceA.label,
        roomResourceB.label,
      ]);
      expect(desks.length).toBe(1);
      expect(desks.map(r => r.label)).toEqual([deskResource.label]);
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
      const newBooking = await api.addBooking({
        ...dummyBooking,
        start: new Date('2021-05-17T08:00:00Z'),
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
      expect(response).toBe(booking);
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
      for (let i = 1; i < resource.seats; i++) {
        // eslint-disable-next-line no-await-in-loop
        const nextBooking = await api.addBooking(dummyBookingInput);
        expect(nextBooking.seatNumber).toBe(i);
      }
    });
    it('sets duration to equal resource.slotDuration', async () => {
      const response = await api.addBooking(dummyBookingInput);

      expect(response.durationMinutes).toEqual(60);
      expect(response.end).toEqual(addMinutes(dummyBookingInput.start, 60));
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
      const invalidBooking = { ...booking, resourceId: 'unknown-id' };

      await expect(api.addBooking(invalidBooking)).rejects.toThrow(
        new ObjectDoesNotExist(
          'Resource unknown-id not found',
          ErrorCode.RESOURCE_DOES_NOT_EXIST
        )
      );
    });
    it('throws BadRequestError if resource is disabled', async () => {
      await api.updateResource(resource.id, { enabled: false });

      await expect(api.addBooking({ ...booking })).rejects.toThrow(
        new BadRequestError(
          `Unable to add booking to disabled resource ${resource.id}`,
          ErrorCode.RESOURCE_IS_DISABLED
        )
      );
    });
    it('throws BadRequestError if resource has no slots left', async () => {
      await api.updateResource(resource.id, { seats: 1 });

      await expect(api.addBooking({ ...booking })).rejects.toThrow(
        new BadRequestError(
          `No available slots in requested period for resource ${resource.id}`,
          ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
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
          `Resource ${resource.id} is not open at requested time`,
          ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
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
          `Booked time 2021-05-17T13:01:00.000Z does not fit into resource ${resource.id} time slots`,
          ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
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
        new ObjectDoesNotExist(
          `Booking does-not-exist does not exist`,
          ErrorCode.BOOKING_DOES_NOT_EXIST
        )
      );
    });
  });
  describe('setBookingComment', () => {
    it('updates comment', async () => {
      expect(booking.comment).toBe('');

      await api.setBookingComment(booking.id, 'hi-there');

      expect((await api.getBooking(booking.id)).comment).toBe('hi-there');
    });
    it('throws ObjectDoesNotExist if booking does not exist', async () => {
      await expect(
        api.setBookingComment('does-not-exist', 'hi-there')
      ).rejects.toThrow(
        new ObjectDoesNotExist(
          `Booking does-not-exist does not exist`,
          ErrorCode.BOOKING_DOES_NOT_EXIST
        )
      );
    });
  });
  describe('findBookings', () => {
    it('returns a list of bookings matching filter', async () => {
      const bookings = await api.findBookings({ resourceIds: [resource.id] });

      expect(bookings.length).toBe(1);
      expect(bookings[0]).toBe(booking);
    });
    it('returns empty list if no bookings matches filter', async () => {
      await api.cancelBooking(booking.id);
      const bookings = await api.findBookings({
        resourceIds: [resource.id],
        includeCanceled: false,
      });

      expect(bookings.length).toBe(0);
    });
    it('returns empty list if resourceId filter is empty list', async () => {
      const bookings = await api.findBookings({ resourceIds: [] });

      expect(bookings.length).toBe(0);
    });
    it('excludes bookings with resourceId different than specified', async () => {
      const bookings = await api.findBookings({
        resourceIds: ['different-resource-id'],
      });

      expect(bookings.length).toBe(0);
    });

    it('returns all non-canceled bookings if filters are not specified', async () => {
      const newBooking = await api.addBooking({ ...booking });
      await api.cancelBooking(newBooking.id);

      const bookings = await api.findBookings();

      expect(bookings.length).toBe(1);
      expect(bookings[0]).toBe(booking);
    });

    it('includes canceled bookings if includeCanceled is true', async () => {
      await api.cancelBooking(booking.id);

      const bookings = await api.findBookings({ includeCanceled: true });

      expect(bookings.length).toBe(1);
      expect(bookings[0].canceled).toBe(true);
    });
    it('excludes bookings with start < from filter', async () => {
      const bookings = await api.findBookings({
        from: new Date(booking.start.getTime() + 1),
      });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with start == from filter', async () => {
      const bookings = await api.findBookings({ from: booking.start });

      expect(bookings.length).toBe(1);
    });
    it('includes bookings with start > from filter', async () => {
      const bookings = await api.findBookings({
        from: new Date(booking.start.getTime() - 1),
      });

      expect(bookings.length).toBe(1);
    });

    it('excludes bookings with start > to filter', async () => {
      const bookings = await api.findBookings({
        to: new Date(booking.start.getTime() - 1),
      });

      expect(bookings.length).toBe(0);
    });
    it('excludes bookings with start == to filter', async () => {
      const bookings = await api.findBookings({ to: booking.start });

      expect(bookings.length).toBe(0);
    });
    it('includes bookings with start < to filter', async () => {
      const bookings = await api.findBookings({
        to: new Date(booking.start.getTime() + 1),
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
        ...booking,
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
  describe('getLatestBooking', () => {
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

      const latestBooking = await api.getLatestBooking();

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

      expect(latestBooking).toBe(oldBookingWithMatchingResource);
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
        from: new Date(booking.start.getTime() + 1),
      });
      // Note: DOES include booking ends after "to", but starts before
      const periodEndingJustAfter = await api.getBookedDuration({
        to: new Date(booking.end.getTime() - 1),
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
