export type HourMinute = string; // e.g. "00:00"
export type IsoDate = string; // e.g. 2020-03-01

export type OpeningHour = {
  start: HourMinute;
  end: HourMinute;
  slotIntervalMinutes: number;
  slotDurationMinutes: number;
};

export type Schedule = {
  mon: OpeningHour;
  tue: OpeningHour;
  wed: OpeningHour;
  thu: OpeningHour;
  fri: OpeningHour;
  sat: OpeningHour;
  sun: OpeningHour;
  overriddenDates: Record<IsoDate, OpeningHour>;
};

export type Resource = {
  id: string;
  // TODO: Should we add category here?
  //   So that we could add 14 x "desk" resource with different labels,
  //   and ask for availability for any resource of category "desk"?
  label: string;
  schedule: Schedule;
  seats: number;
  enabled: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  resourceId: string;
  start: Date;
  end: Date;
  canceled: boolean;
};

export type TimeSlot = {
  availableSeats: number;
  start: Date;
  end: Date;
};

export interface IBookingAPI {
  getResource(resourceId: string): Promise<Resource | undefined>;
  addResource(resource: Resource): Promise<Resource>;
  updateResource(
    resourceId: string,
    resource: Partial<Resource>
  ): Promise<Resource>;
  deleteResource(resourceId: string): Promise<void>;
  findResources(): Promise<Resource[]>;

  getNextAvailable(resourceId: string): Promise<TimeSlot | undefined>;
  findAvailability(props: {
    resourceId: string;
    from?: Date;
    to?: Date;
  }): Promise<TimeSlot[]>;

  getBooking(bookingId: string): Promise<Booking | undefined>;
  addBooking(booking: Omit<Booking, 'id'>): Promise<Booking>;
  cancelBooking(bookingId: string): Promise<void>;
  findsBookings(props: {
    userId?: string;
    resourceIds?: string[];
    from?: Date;
    to?: Date;
    includeCanceled?: boolean;
  }): Promise<Booking[]>;

  getLatestBooking(props: {
    userId?: string;
    resourceIds?: string[];
    before?: Date;
  }): Promise<Booking | undefined>;
  getBookedDuration(
    userId: string,
    resourceIds?: string[],
    from?: Date,
    to?: Date
  ): Promise<{ minutes: number; bookingIds: string[] }>;
}
