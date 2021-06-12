export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddBookingInput = {
  id: Scalars['String'];
  customerId: Scalars['String'];
  userId: Scalars['String'];
  resourceId: Scalars['String'];
  start: Scalars['Int'];
  end: Scalars['Int'];
  canceled?: Maybe<Scalars['Boolean']>;
  comment?: Maybe<Scalars['String']>;
  seatNumber: Scalars['Int'];
};

export type AddCustomerInput = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  credits?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AddResourceInput = {
  id?: Maybe<Scalars['String']>;
  customerId: Scalars['String'];
  category?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  seats: Scalars['Int'];
  enabled: Scalars['Boolean'];
  schedule: Array<DateScheduleInput>;
};

export type BookedDuration = {
  __typename?: 'BookedDuration';
  minutes: Scalars['Int'];
  bookingIds: Array<Scalars['String']>;
  numBookings: Scalars['Int'];
};

export type Booking = {
  __typename?: 'Booking';
  id: Scalars['String'];
  customer: Customer;
  userId: Scalars['String'];
  resourceId: Scalars['String'];
  start: Scalars['Int'];
  end: Scalars['Int'];
  canceled: Scalars['Boolean'];
  comment?: Maybe<Scalars['String']>;
  seatNumber: Scalars['Int'];
};

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  issuer: Scalars['String'];
  credits: Scalars['Int'];
  enabled: Scalars['Boolean'];
};

export type DateSchedule = {
  __typename?: 'DateSchedule';
  isoDate: Scalars['String'];
  schedule: HourSchedule;
};

export type DateScheduleInput = {
  day: Scalars['String'];
  start: Scalars['String'];
  end: Scalars['String'];
  slotIntervalMinutes: Scalars['Int'];
  slotDurationMinutes: Scalars['Int'];
};

export type FindAvailabilityInput = {
  customerId: Scalars['String'];
  resourceIds: Array<Scalars['String']>;
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
};

export type FindBookingInput = {
  customerId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  resourceIds?: Maybe<Array<Scalars['String']>>;
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
  includeCanceled?: Maybe<Scalars['Boolean']>;
};

export type FindResourceInput = {
  customerId?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type HourSchedule = {
  __typename?: 'HourSchedule';
  start: Scalars['String'];
  end: Scalars['String'];
  slotIntervalMinutes: Scalars['Int'];
  slotDurationMinutes: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addResource?: Maybe<Resource>;
  updateResource?: Maybe<Resource>;
  updateCustomer?: Maybe<Customer>;
  addBooking?: Maybe<Booking>;
  disableResource?: Maybe<Resource>;
  cancelBooking?: Maybe<Booking>;
  addCustomer?: Maybe<Customer>;
  disableCustomer?: Maybe<Customer>;
};

export type MutationAddResourceArgs = {
  addResourceInput: AddResourceInput;
};

export type MutationUpdateResourceArgs = {
  input: UpdateResourceInput;
};

export type MutationUpdateCustomerArgs = {
  addCustomerInput: UpdateCustomerInput;
};

export type MutationAddBookingArgs = {
  addBookingInput: AddBookingInput;
};

export type MutationDisableResourceArgs = {
  id: Scalars['String'];
};

export type MutationCancelBookingArgs = {
  id: Scalars['String'];
};

export type MutationAddCustomerArgs = {
  addCustomerInput: AddCustomerInput;
};

export type MutationDisableCustomerArgs = {
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getResourceById?: Maybe<Resource>;
  getBookingById?: Maybe<Booking>;
  getCustomerByIssuer?: Maybe<Customer>;
  getCustomerByEmail?: Maybe<Customer>;
  getCustomerById?: Maybe<Customer>;
  findResources?: Maybe<Array<Maybe<Resource>>>;
  findBookings?: Maybe<Array<Maybe<Booking>>>;
  findAvailability?: Maybe<Array<Maybe<TimeSlot>>>;
  getNextAvailable?: Maybe<TimeSlot>;
  getLatestBooking?: Maybe<Booking>;
  getBookedDuration?: Maybe<BookedDuration>;
};

export type QueryGetResourceByIdArgs = {
  id: Scalars['String'];
};

export type QueryGetBookingByIdArgs = {
  id: Scalars['String'];
};

export type QueryGetCustomerByIssuerArgs = {
  issuer: Scalars['String'];
};

export type QueryGetCustomerByEmailArgs = {
  email: Scalars['String'];
};

export type QueryGetCustomerByIdArgs = {
  id: Scalars['String'];
};

export type QueryFindResourcesArgs = {
  filterResource: FindResourceInput;
};

export type QueryFindBookingsArgs = {
  filterBookings: FindBookingInput;
};

export type QueryFindAvailabilityArgs = {
  filterAvailability: FindAvailabilityInput;
};

export type QueryGetNextAvailableArgs = {
  id: Scalars['String'];
};

export type QueryGetLatestBookingArgs = {
  filterBookings: FindBookingInput;
};

export type QueryGetBookedDurationArgs = {
  filterBookings: FindBookingInput;
};

export type Resource = {
  __typename?: 'Resource';
  id: Scalars['String'];
  customer: Customer;
  category?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  schedule: Schedule;
  seats: Scalars['Int'];
  enabled: Scalars['Boolean'];
};

export type Schedule = {
  __typename?: 'Schedule';
  mon: HourSchedule;
  tue: HourSchedule;
  wed: HourSchedule;
  thu: HourSchedule;
  fri: HourSchedule;
  sat: HourSchedule;
  sun: HourSchedule;
  overriddenDates?: Maybe<Array<Maybe<DateSchedule>>>;
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  availableSeats: Scalars['Int'];
  start: Scalars['Int'];
  end: Scalars['Int'];
};

export type UpdateCustomerInput = {
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  credits?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type UpdateResourceInput = {
  id: Scalars['String'];
  category?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  seats?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
  schedule?: Maybe<Array<Maybe<DateScheduleInput>>>;
};
