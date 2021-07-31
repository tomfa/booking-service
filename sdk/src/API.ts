import { GraphQLClient } from 'graphql-request';
import {
  Booking,
  CreateBookingArgs,
  CreateResourceArgs,
  IBookingAPI,
  Resource,
  TimeSlot,
} from './types';

import { ErrorCode, ObjectDoesNotExist } from './errors';
import { getSdk } from './graphql/generated/types';
import {
  toGQLSchedule,
  fromGQLBooking,
  mapToTimeSlot,
  fromGQLResource,
} from './mappers';
import { toGQLDate } from './utils';

export default class BookingAPI implements IBookingAPI {
  private token: string;
  private baseUrl: string;
  private graphQlClient: GraphQLClient;
  public client: ReturnType<typeof getSdk>;

  constructor({
    token,
    baseUrl = 'https://api.vailable.eu/graphql',
  }: {
    token?: string;
    baseUrl?: string;
  } = {}) {
    this.baseUrl = baseUrl;
    this.graphQlClient = new GraphQLClient(baseUrl);
    this.client = getSdk(this.graphQlClient);
    if (token) {
      this.setToken(token);
    }
  }

  setToken(token: string): void {
    this.token = token;
    this.graphQlClient.setHeader('Authorization', `Bearer ${token}`);
  }

  async getResource(resourceId: string): Promise<Resource> {
    const { getResourceById: resource } = await this.client.getResourceById({
      id: resourceId,
    });
    if (!resource) {
      throw new ObjectDoesNotExist(
        `Resource ${resourceId} not found`,
        ErrorCode.RESOURCE_DOES_NOT_EXIST
      );
    }
    return fromGQLResource(resource);
  }

  async addResource(
    { schedule, ...resource }: CreateResourceArgs,
    resourceId?: string
  ): Promise<Resource> {
    const result = await this.client.addResource({
      addResourceInput: {
        id: resourceId,
        schedule: toGQLSchedule(schedule),
        ...resource,
      },
    });
    return fromGQLResource(result.addResource);
  }

  async updateResource(
    resourceId: string,
    { schedule, ...updatedResource }: Partial<Omit<CreateResourceArgs, 'id'>>
  ): Promise<Resource> {
    const { updateResource: resource } = await this.client.updateResource({
      updateResourceInput: {
        ...updatedResource,
        id: resourceId,
        schedule: toGQLSchedule(schedule),
      },
    });
    if (!resource) {
      throw new ObjectDoesNotExist(
        `Resource ${resourceId} not found`,
        ErrorCode.RESOURCE_DOES_NOT_EXIST
      );
    }
    return fromGQLResource(resource);
  }

  async deleteResource(resourceId: string): Promise<void> {
    await this.client.disableResource({ id: resourceId });
  }

  async findResources(filters?: Partial<Resource>): Promise<Resource[]> {
    const { findResources } = await this.client.findResources({
      filterResource: filters || {},
    });
    return findResources.map(fromGQLResource);
  }

  async getNextAvailable(
    resourceId: string,
    after: Date = new Date()
  ): Promise<TimeSlot | undefined> {
    const { getNextAvailable } = await this.client.getNextAvailable({
      id: resourceId,
      afterDate: toGQLDate(after),
    });
    return mapToTimeSlot(getNextAvailable);
  }

  async findAvailability({
    resourceId,
    ...props
  }: {
    resourceId: string;
    from?: Date;
    to?: Date;
  }): Promise<TimeSlot[]> {
    const { findAvailability } = await this.client.findAvailability({
      filterAvailability: {
        resourceIds: [resourceId],
        from: props.from && toGQLDate(props.from),
        to: props.to && toGQLDate(props.to),
      },
    });
    return findAvailability.map(mapToTimeSlot);
  }

  async getBooking(bookingId: string): Promise<Booking> {
    const { getBookingById: booking } = await this.client.getBookingById({
      id: bookingId,
    });
    if (!booking) {
      throw new ObjectDoesNotExist(
        `Booking ${bookingId} does not exist`,
        ErrorCode.BOOKING_DOES_NOT_EXIST
      );
    }
    return fromGQLBooking(booking);
  }

  async addBooking(booking: CreateBookingArgs): Promise<Booking> {
    const { addBooking } = await this.client.addBooking({
      addBookingInput: {
        ...booking,
        start: toGQLDate(booking.start),
        end: booking.end && toGQLDate(booking.end),
      },
    });
    return fromGQLBooking(addBooking);
  }

  async setBookingComment(
    bookingId: string,
    comment: string
  ): Promise<Booking> {
    const { setBookingComment: booking } = await this.client.setBookingComment({
      id: bookingId,
      comment,
    });
    return fromGQLBooking(booking);
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const { cancelBooking: existingBooking } = await this.client.cancelBooking({
      id: bookingId,
    });

    if (!existingBooking) {
      throw new ObjectDoesNotExist(
        `Booking with id ${bookingId} does not exist`,
        ErrorCode.BOOKING_DOES_NOT_EXIST
      );
    }

    return fromGQLBooking(existingBooking);
  }

  async findBookings({
    userId,
    resourceCategories,
    resourceIds,
    from,
    to,
    includeCanceled,
  }: {
    userId?: string;
    resourceIds?: string[];
    resourceCategories?: string[];
    from?: Date;
    to?: Date;
    includeCanceled?: boolean;
  } = {}): Promise<Booking[]> {
    const { findBookings } = await this.client.findBookings({
      filterBookings: {
        userId,
        resourceIds,
        from: from && toGQLDate(from),
        to: to && toGQLDate(to),
        includeCanceled,
        resourceCategories,
      },
    });
    return findBookings.map(fromGQLBooking);
  }

  async getLatestBooking({
    userId,
    resourceIds,
    before,
  }: {
    userId?: string;
    resourceIds?: string[];
    before?: Date;
  } = {}): Promise<Booking | undefined> {
    const { getLatestBooking: booking } = await this.client.getLatestBooking({
      filterBookings: { to: before && toGQLDate(before), resourceIds, userId },
    });
    if (!booking) {
      return undefined;
    }
    return fromGQLBooking(booking);
  }

  async getBookedDuration({
    userId,
    resourceIds,
    from,
    to,
  }: {
    userId?: string;
    resourceIds?: string[];
    from?: Date;
    to?: Date;
  } = {}): Promise<{
    minutes: number;
    bookingIds: string[];
    numBookings: number;
  }> {
    const {
      getBookedDuration: bookedDuration,
    } = await this.client.getBookedDuration({
      filterBookings: {
        to: to && toGQLDate(to),
        from: from && toGQLDate(from),
        resourceIds,
        userId,
      },
    });
    return bookedDuration;
  }
}
