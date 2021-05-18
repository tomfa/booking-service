import { Booking, IBookingAPI, Resource, TimeSlot } from './BookingAPI.types';
import * as utils from './utils';
import { verifyIsBookable } from './utils';
import {
  BadRequestError,
  ConflictingObjectExists,
  ObjectDoesNotExist,
} from './errors';

export default class BookingAPI implements IBookingAPI {
  private resources: Resource[] = [];

  private bookings: Booking[] = [];

  private apiKey: string;

  private baseUrl: string;

  constructor({
    apiKey,
    baseUrl = 'https://api.vailable.eu',
  }: {
    apiKey: string;
    baseUrl?: string;
  }) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getResource(resourceId: string): Promise<Resource> {
    const resource = this.resources.find(r => r.id === resourceId);
    if (!resource) {
      throw new ObjectDoesNotExist(`Resource ${resourceId} not found`);
    }
    return Promise.resolve(resource);
  }

  async addResource(
    resource: Omit<Resource, 'id'>,
    resourceId?: string
  ): Promise<Resource> {
    const resourceWithSameLabel = this.resources.find(
      r => r.label === resource.label
    );
    if (resourceWithSameLabel) {
      throw new ConflictingObjectExists(
        `Resource with label ${resource.label} already exists`
      );
    }
    const id = resourceId || '_' + Math.random().toString(36).substr(2, 9);
    const resourceWithSameId = this.resources.find(r => r.id === resourceId);
    if (resourceWithSameId) {
      throw new ConflictingObjectExists(
        `Resource with id ${id} already exists`
      );
    }
    const newResource = { ...resource, id };
    this.resources.push(newResource);
    return Promise.resolve(newResource);
  }

  async updateResource(
    resourceId: string,
    resource: Partial<Resource>
  ): Promise<Resource> {
    const existingResource = await this.getResource(resourceId);
    if (resource.id && resource.id !== existingResource.id) {
      throw new BadRequestError(`Can not change the id of a Resource.`);
    }
    const updatedResource = { ...existingResource, ...resource };
    this.resources = this.resources.map(existing =>
      existing.id === existingResource.id ? updatedResource : existing
    );
    return Promise.resolve(updatedResource);
  }

  async deleteResource(resourceId: string): Promise<void> {
    const existingResource = await this.getResource(resourceId);
    this.resources = this.resources.filter(r => r.id !== existingResource.id);
  }

  async findResources(filters?: Partial<Resource>): Promise<Resource[]> {
    const matchesFiltering = (resource: Resource) => {
      if (!filters) {
        return true;
      }
      const withUpdateString = JSON.stringify({
        ...resource,
        ...filters,
      });
      return withUpdateString === JSON.stringify(resource);
    };
    return Promise.resolve(this.resources.filter(matchesFiltering));
  }

  async getNextAvailable(
    resourceId: string,
    after: Date = new Date()
  ): Promise<TimeSlot | undefined> {
    const availableSlots = await this.findAvailability({
      resourceId,
      from: after,
    });
    if (!availableSlots.length) {
      return undefined;
    }
    // TODO: Only luck that it is ordered by time
    const slotClosestInTime = availableSlots.find(
      slot => slot.availableSeats >= 1
    );
    return slotClosestInTime;
  }

  async findAvailability({
    resourceId,
    ...props
  }: {
    resourceId: string;
    from?: Date;
    to?: Date;
  }): Promise<TimeSlot[]> {
    const from = props.from || new Date();
    const to = props.to || new Date(from.getTime() + 31 * 24 * 3600 * 1000);

    const resource = await this.getResource(resourceId);
    if (!resource.enabled) {
      return [];
    }
    const tempSlots: TimeSlot[] = utils.constructAllSlots({
      resource,
      from,
      to,
    });
    const bookings = await this.findsBookings({
      from,
      to,
      resourceIds: [resourceId],
      includeCanceled: false,
    });
    const slotsWithCorrectAvailability: TimeSlot[] = utils.reduceAvailability(
      tempSlots,
      bookings
    );
    return Promise.resolve(slotsWithCorrectAvailability);
  }

  async getBooking(bookingId: string): Promise<Booking> {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new ObjectDoesNotExist(`Booking ${bookingId} does not exist`);
    }
    return booking;
  }

  async addBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const id = '_' + Math.random().toString(36).substr(2, 9);
    const newBooking = { ...booking, id };
    const resource = await this.getResource(newBooking.resourceId);
    verifyIsBookable(resource, this.bookings, newBooking);
    this.bookings.push(newBooking);
    return Promise.resolve(newBooking);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const existingBooking = await this.getBooking(bookingId);
    if (!existingBooking) {
      throw new ObjectDoesNotExist(
        `Booking with id ${bookingId} does not exist`
      );
    }
    if (existingBooking.canceled) {
      return;
    }
    const updatedBooking: Booking = { ...existingBooking, canceled: true };
    this.bookings = this.bookings.map(booking =>
      booking.id === bookingId ? updatedBooking : booking
    );
  }

  async findsBookings({
    userId,
    resourceIds,
    from,
    to,
    includeCanceled,
  }: {
    userId?: string;
    resourceIds?: string[];
    from?: Date;
    to?: Date;
    includeCanceled?: boolean;
  } = {}): Promise<Booking[]> {
    if (resourceIds && resourceIds.length === 0) {
      return [];
    }
    const matchesFilters = (booking: Booking) => {
      if (userId && userId !== booking.userId) {
        return false;
      }
      if (resourceIds && !resourceIds.includes(booking.resourceId)) {
        return false;
      }
      if (from && from.getTime() > booking.start.getTime()) {
        return false;
      }
      if (to && to.getTime() <= booking.start.getTime()) {
        return false;
      }
      if (!includeCanceled && booking.canceled) {
        return false;
      }
      return true;
    };
    return Promise.resolve(this.bookings.filter(matchesFilters));
  }

  async getLatestBooking({
    userId,
    resourceIds,
    before,
  }: {
    userId?: string;
    resourceIds?: string[];
    before?: Date;
  }): Promise<Booking | undefined> {
    const matchingBookings = await this.findsBookings({
      userId,
      resourceIds,
      to: before,
    });
    if (!matchingBookings.length) {
      return undefined;
    }
    const sortedNewestFirst = matchingBookings.sort((a, b) => {
      const aTime = a.start.getTime();
      const bTime = b.start.getTime();
      if (aTime > bTime) {
        return 1;
      }
      if (aTime < bTime) {
        return -1;
      }
      return 0;
    });
    return sortedNewestFirst[0];
  }

  async getBookedDuration(
    userId: string,
    resourceIds?: string[],
    from?: Date,
    to?: Date
  ): Promise<{ minutes: number; bookingIds: string[] }> {
    const matchingBookings = await this.findsBookings({
      userId,
      resourceIds,
      from,
      to,
    });
    const bookingIds = matchingBookings.map(b => b.id);
    const minutes = matchingBookings.reduce(
      (sum, booking) => sum + utils.getBookingDurationMinutes(booking),
      0
    );
    return { minutes, bookingIds };
  }
}
