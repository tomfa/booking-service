export type HourMinute = string; // e.g. "00:00".
export type IsoDate = string; // e.g. 2020-03-01

export type Closed = 'closed';
export type HourSchedule = {
  start: HourMinute;
  end: HourMinute;
  slotIntervalMinutes: number;
  slotDurationMinutes: number;
};

export type OpeningHour = HourSchedule | Closed;
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
  category: string;
  label: string;
  schedule: Schedule;
  // TODO: How to solve not available until/after
  seats: number;
  enabled: boolean;
};

export type CreateResourceArgs = Omit<Resource, 'id' | 'category'> & {
  category?: string;
};

export type Booking = {
  id: string;
  userId: string;
  resourceId: string;
  start: Date;
  durationMinutes: number;
  end: Date;
  canceled: boolean;
  comment: string;
  seatNumber: number;
};

export type CreateBookingArgs = Omit<
  Booking,
  'id' | 'canceled' | 'end' | 'durationMinutes' | 'seatNumber' | 'comment'
> & { comment?: string };

export type TimeSlot = {
  availableSeats: number;
  start: Date;
  end: Date;
};

export interface IBookingAPI {
  getResource(resourceId: string): Promise<Resource | undefined>;
  addResource(
    resource: CreateResourceArgs,
    resourceId: string
  ): Promise<Resource>;
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
  setBookingComment(bookingId: string, comment: string): Promise<Booking>;
  cancelBooking(bookingId: string): Promise<Booking>;
  findBookings(props: {
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
  getBookedDuration(props: {
    userId: string;
    resourceIds?: string[];
    from?: Date;
    to?: Date;
  }): Promise<{ minutes: number; bookingIds: string[]; numBookings: number }>;
}
