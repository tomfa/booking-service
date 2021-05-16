import BookingAPI from './BookingAPI.mock';
import { Booking, Resource, Schedule } from './BookingAPI.types';
import { openingHourGenerator } from './utils';
import {
  BadRequestError,
  ConflictingResourceExists,
  ResourceDoesNotExist,
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

  beforeEach(async () => {
    api = new BookingAPI({ apiKey: 'dummy-key' });
    await api.addResource(dummyResource, dummyResourceId);
    await api.addBooking(dummyBooking);
  });

  describe('getResource', () => {
    it('returns resource', async () => {
      const response = await api.getResource(dummyResourceId);
      expect(response).toEqual({ ...dummyResource, id: dummyResourceId });
    });
    it('throws ResourceDoesNotExist if resource does not exist', async () => {
      await expect(api.getResource('invalid-id')).rejects.toThrowError(
        ResourceDoesNotExist
      );
    });
  });
  describe('addResource', () => {
    it('adds a new resource with a random id', async () => {
      const newResource = { ...dummyResource, label: 'A new resource' };

      const resource = await api.addResource(newResource);

      expect(resource).toEqual(expect.objectContaining(newResource));
      expect(resource.id).toBeTruthy();
    });
    it('can optionally have id specified by caller', async () => {
      const newResource = { ...dummyResource, label: 'A new resource' };
      const predeterminedId = 'cheesedoodles';

      const resource = await api.addResource(newResource, predeterminedId);

      expect(resource).toEqual(expect.objectContaining(newResource));
      expect(resource.id).toBe(predeterminedId);
    });
    it('throws ConflictingResourceExists if label is already taken', async () => {
      const newResource = { ...dummyResource, label: dummyResource.label };

      await expect(api.addResource(newResource)).rejects.toThrowError(
        ConflictingResourceExists
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
      ).rejects.toThrowError(BadRequestError);
    });
  });
  describe('deleteResource', () => {
    it('deletes the resource', async () => {
      expect(await api.getResource(dummyResourceId)).toBeTruthy();

      await api.deleteResource(dummyResourceId);

      await expect(api.getResource(dummyResourceId)).rejects.toThrowError(
        ResourceDoesNotExist
      );
    });
    it('throws ResourceDoesNotExist if no resource found', async () => {
      await expect(api.deleteResource('non-existing-id')).rejects.toThrowError(
        ResourceDoesNotExist
      );
    });
  });
  describe.skip('findResources', () => {
    it('works', async () => {
      const response = true; // await api.findResources();
      expect(response).toBe(true);
    });
  });
  describe.skip('getNextAvailable', () => {
    it('works', async () => {
      const response = true; // await api.getNextAvailable();
      expect(response).toBe(true);
    });
  });
  describe.skip('findAvailability', () => {
    it('works', async () => {
      const response = true; // await api.findAvailability();
      expect(response).toBe(true);
    });
  });
  describe.skip('getBooking', () => {
    it('works', async () => {
      const response = true; // await api.getBooking();
      expect(response).toBe(true);
    });
  });
  describe.skip('addBooking', () => {
    it('works', async () => {
      const response = true; // await api.addBooking();
      expect(response).toBe(true);
    });
  });
  describe.skip('cancelBooking', () => {
    it('works', async () => {
      const response = true; // await api.cancelBooking();
      expect(response).toBe(true);
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
