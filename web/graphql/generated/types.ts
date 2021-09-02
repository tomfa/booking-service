import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddBookingInput = {
  id?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  resourceId: Scalars['String'];
  start: Scalars['Int'];
  end?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
};

export type AddCustomerInput = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  credits?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
  publicKeys?: Maybe<Array<Scalars['String']>>;
};

export type AddResourceInput = {
  id?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
  resourceId: Scalars['String'];
  start: Scalars['Int'];
  end: Scalars['Int'];
  canceled: Scalars['Boolean'];
  comment?: Maybe<Scalars['String']>;
  seatNumber?: Maybe<Scalars['Int']>;
};

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  credits: Scalars['Int'];
  enabled: Scalars['Boolean'];
  publicKeys?: Maybe<Array<Scalars['String']>>;
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
  customerId?: Maybe<Scalars['String']>;
  resourceIds: Array<Scalars['String']>;
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
};

export type FindBookingInput = {
  customerId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  resourceIds?: Maybe<Array<Scalars['String']>>;
  resourceCategories?: Maybe<Array<Scalars['String']>>;
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
  includeCanceled?: Maybe<Scalars['Boolean']>;
};

export type FindResourceInput = {
  resourceIds?: Maybe<Array<Scalars['String']>>;
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
  setBookingComment?: Maybe<Booking>;
  addCustomer?: Maybe<Customer>;
  disableCustomer?: Maybe<Customer>;
  deleteCustomer?: Maybe<Customer>;
  addSigningKey?: Maybe<Customer>;
  deleteSigningKey?: Maybe<Customer>;
};


export type MutationAddResourceArgs = {
  addResourceInput: AddResourceInput;
};


export type MutationUpdateResourceArgs = {
  updateResourceInput: UpdateResourceInput;
};


export type MutationUpdateCustomerArgs = {
  updateCustomerInput: UpdateCustomerInput;
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


export type MutationSetBookingCommentArgs = {
  id: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};


export type MutationAddCustomerArgs = {
  addCustomerInput: AddCustomerInput;
};


export type MutationDisableCustomerArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['String'];
};


export type MutationAddSigningKeyArgs = {
  key: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
};


export type MutationDeleteSigningKeyArgs = {
  key: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<Customer>;
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
  afterDate?: Maybe<Scalars['Int']>;
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
  id: Scalars['String'];
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
  schedule?: Maybe<Array<DateScheduleInput>>;
};

export type AddBookingMutationVariables = Exact<{
  addBookingInput: AddBookingInput;
}>;


export type AddBookingMutation = (
  { __typename?: 'Mutation' }
  & { addBooking?: Maybe<(
    { __typename?: 'Booking' }
    & Pick<Booking, 'id' | 'userId' | 'resourceId' | 'start' | 'end' | 'canceled' | 'comment' | 'seatNumber'>
  )> }
);

export type AddCustomerMutationVariables = Exact<{
  addCustomerInput: AddCustomerInput;
}>;


export type AddCustomerMutation = (
  { __typename?: 'Mutation' }
  & { addCustomer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type AddResourceMutationVariables = Exact<{
  addResourceInput: AddResourceInput;
}>;


export type AddResourceMutation = (
  { __typename?: 'Mutation' }
  & { addResource?: Maybe<(
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'category' | 'label' | 'seats' | 'enabled'>
    & { schedule: (
      { __typename?: 'Schedule' }
      & { mon: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), tue: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), wed: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), thu: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), fri: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sat: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sun: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), overriddenDates?: Maybe<Array<Maybe<(
        { __typename?: 'DateSchedule' }
        & Pick<DateSchedule, 'isoDate'>
        & { schedule: (
          { __typename?: 'HourSchedule' }
          & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
        ) }
      )>>> }
    ) }
  )> }
);

export type AddSigningKeyMutationVariables = Exact<{
  key: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
}>;


export type AddSigningKeyMutation = (
  { __typename?: 'Mutation' }
  & { addSigningKey?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type CancelBookingMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CancelBookingMutation = (
  { __typename?: 'Mutation' }
  & { cancelBooking?: Maybe<(
    { __typename?: 'Booking' }
    & Pick<Booking, 'id' | 'userId' | 'resourceId' | 'start' | 'end' | 'canceled' | 'comment' | 'seatNumber'>
  )> }
);

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCustomerMutation = (
  { __typename?: 'Mutation' }
  & { deleteCustomer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type DeleteSigningKeyMutationVariables = Exact<{
  key: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
}>;


export type DeleteSigningKeyMutation = (
  { __typename?: 'Mutation' }
  & { deleteSigningKey?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type DisableCustomerMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DisableCustomerMutation = (
  { __typename?: 'Mutation' }
  & { disableCustomer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type DisableResourceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DisableResourceMutation = (
  { __typename?: 'Mutation' }
  & { disableResource?: Maybe<(
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'category' | 'label' | 'seats' | 'enabled'>
    & { schedule: (
      { __typename?: 'Schedule' }
      & { mon: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), tue: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), wed: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), thu: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), fri: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sat: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sun: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), overriddenDates?: Maybe<Array<Maybe<(
        { __typename?: 'DateSchedule' }
        & Pick<DateSchedule, 'isoDate'>
        & { schedule: (
          { __typename?: 'HourSchedule' }
          & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
        ) }
      )>>> }
    ) }
  )> }
);

export type SetBookingCommentMutationVariables = Exact<{
  id: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
}>;


export type SetBookingCommentMutation = (
  { __typename?: 'Mutation' }
  & { setBookingComment?: Maybe<(
    { __typename?: 'Booking' }
    & Pick<Booking, 'id' | 'userId' | 'resourceId' | 'start' | 'end' | 'canceled' | 'comment' | 'seatNumber'>
  )> }
);

export type UpdateCustomerMutationVariables = Exact<{
  updateCustomerInput: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = (
  { __typename?: 'Mutation' }
  & { updateCustomer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type UpdateResourceMutationVariables = Exact<{
  updateResourceInput: UpdateResourceInput;
}>;


export type UpdateResourceMutation = (
  { __typename?: 'Mutation' }
  & { updateResource?: Maybe<(
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'category' | 'label' | 'seats' | 'enabled'>
    & { schedule: (
      { __typename?: 'Schedule' }
      & { mon: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), tue: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), wed: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), thu: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), fri: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sat: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sun: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), overriddenDates?: Maybe<Array<Maybe<(
        { __typename?: 'DateSchedule' }
        & Pick<DateSchedule, 'isoDate'>
        & { schedule: (
          { __typename?: 'HourSchedule' }
          & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
        ) }
      )>>> }
    ) }
  )> }
);

export type FindAvailabilityQueryVariables = Exact<{
  filterAvailability: FindAvailabilityInput;
}>;


export type FindAvailabilityQuery = (
  { __typename?: 'Query' }
  & { findAvailability?: Maybe<Array<Maybe<(
    { __typename?: 'TimeSlot' }
    & Pick<TimeSlot, 'availableSeats' | 'start' | 'end'>
  )>>> }
);

export type FindBookingsQueryVariables = Exact<{
  filterBookings: FindBookingInput;
}>;


export type FindBookingsQuery = (
  { __typename?: 'Query' }
  & { findBookings?: Maybe<Array<Maybe<(
    { __typename?: 'Booking' }
    & Pick<Booking, 'id' | 'userId' | 'resourceId' | 'start' | 'end' | 'canceled' | 'comment' | 'seatNumber'>
  )>>> }
);

export type FindResourcesQueryVariables = Exact<{
  filterResource: FindResourceInput;
}>;


export type FindResourcesQuery = (
  { __typename?: 'Query' }
  & { findResources?: Maybe<Array<Maybe<(
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'category' | 'label' | 'seats' | 'enabled'>
    & { schedule: (
      { __typename?: 'Schedule' }
      & { mon: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), tue: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), wed: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), thu: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), fri: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sat: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sun: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), overriddenDates?: Maybe<Array<Maybe<(
        { __typename?: 'DateSchedule' }
        & Pick<DateSchedule, 'isoDate'>
        & { schedule: (
          { __typename?: 'HourSchedule' }
          & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
        ) }
      )>>> }
    ) }
  )>>> }
);

export type GetBookedDurationQueryVariables = Exact<{
  filterBookings: FindBookingInput;
}>;


export type GetBookedDurationQuery = (
  { __typename?: 'Query' }
  & { getBookedDuration?: Maybe<(
    { __typename?: 'BookedDuration' }
    & Pick<BookedDuration, 'minutes' | 'bookingIds' | 'numBookings'>
  )> }
);

export type GetBookingByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetBookingByIdQuery = (
  { __typename?: 'Query' }
  & { getBookingById?: Maybe<(
    { __typename?: 'Booking' }
    & Pick<Booking, 'id' | 'userId' | 'resourceId' | 'start' | 'end' | 'canceled' | 'comment' | 'seatNumber'>
  )> }
);

export type GetCustomerByEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetCustomerByEmailQuery = (
  { __typename?: 'Query' }
  & { getCustomerByEmail?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type GetCustomerByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetCustomerByIdQuery = (
  { __typename?: 'Query' }
  & { getCustomerById?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type GetCustomerByIssuerQueryVariables = Exact<{
  issuer: Scalars['String'];
}>;


export type GetCustomerByIssuerQuery = (
  { __typename?: 'Query' }
  & { getCustomerByIssuer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);

export type GetLatestBookingQueryVariables = Exact<{
  filterBookings: FindBookingInput;
}>;


export type GetLatestBookingQuery = (
  { __typename?: 'Query' }
  & { getLatestBooking?: Maybe<(
    { __typename?: 'Booking' }
    & Pick<Booking, 'id' | 'userId' | 'resourceId' | 'start' | 'end' | 'canceled' | 'comment' | 'seatNumber'>
  )> }
);

export type GetNextAvailableQueryVariables = Exact<{
  id: Scalars['String'];
  afterDate?: Maybe<Scalars['Int']>;
}>;


export type GetNextAvailableQuery = (
  { __typename?: 'Query' }
  & { getNextAvailable?: Maybe<(
    { __typename?: 'TimeSlot' }
    & Pick<TimeSlot, 'availableSeats' | 'start' | 'end'>
  )> }
);

export type GetResourceByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetResourceByIdQuery = (
  { __typename?: 'Query' }
  & { getResourceById?: Maybe<(
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'category' | 'label' | 'seats' | 'enabled'>
    & { schedule: (
      { __typename?: 'Schedule' }
      & { mon: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), tue: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), wed: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), thu: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), fri: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sat: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), sun: (
        { __typename?: 'HourSchedule' }
        & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
      ), overriddenDates?: Maybe<Array<Maybe<(
        { __typename?: 'DateSchedule' }
        & Pick<DateSchedule, 'isoDate'>
        & { schedule: (
          { __typename?: 'HourSchedule' }
          & Pick<HourSchedule, 'start' | 'end' | 'slotIntervalMinutes' | 'slotDurationMinutes'>
        ) }
      )>>> }
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled' | 'publicKeys'>
  )> }
);


export const AddBookingDocument = gql`
    mutation addBooking($addBookingInput: AddBookingInput!) {
  addBooking(addBookingInput: $addBookingInput) {
    id
    userId
    resourceId
    start
    end
    canceled
    comment
    seatNumber
  }
}
    `;
export type AddBookingMutationFn = Apollo.MutationFunction<AddBookingMutation, AddBookingMutationVariables>;

/**
 * __useAddBookingMutation__
 *
 * To run a mutation, you first call `useAddBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBookingMutation, { data, loading, error }] = useAddBookingMutation({
 *   variables: {
 *      addBookingInput: // value for 'addBookingInput'
 *   },
 * });
 */
export function useAddBookingMutation(baseOptions?: Apollo.MutationHookOptions<AddBookingMutation, AddBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBookingMutation, AddBookingMutationVariables>(AddBookingDocument, options);
      }
export type AddBookingMutationHookResult = ReturnType<typeof useAddBookingMutation>;
export type AddBookingMutationResult = Apollo.MutationResult<AddBookingMutation>;
export type AddBookingMutationOptions = Apollo.BaseMutationOptions<AddBookingMutation, AddBookingMutationVariables>;
export const AddCustomerDocument = gql`
    mutation addCustomer($addCustomerInput: AddCustomerInput!) {
  addCustomer(addCustomerInput: $addCustomerInput) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;
export type AddCustomerMutationFn = Apollo.MutationFunction<AddCustomerMutation, AddCustomerMutationVariables>;

/**
 * __useAddCustomerMutation__
 *
 * To run a mutation, you first call `useAddCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCustomerMutation, { data, loading, error }] = useAddCustomerMutation({
 *   variables: {
 *      addCustomerInput: // value for 'addCustomerInput'
 *   },
 * });
 */
export function useAddCustomerMutation(baseOptions?: Apollo.MutationHookOptions<AddCustomerMutation, AddCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCustomerMutation, AddCustomerMutationVariables>(AddCustomerDocument, options);
      }
export type AddCustomerMutationHookResult = ReturnType<typeof useAddCustomerMutation>;
export type AddCustomerMutationResult = Apollo.MutationResult<AddCustomerMutation>;
export type AddCustomerMutationOptions = Apollo.BaseMutationOptions<AddCustomerMutation, AddCustomerMutationVariables>;
export const AddResourceDocument = gql`
    mutation addResource($addResourceInput: AddResourceInput!) {
  addResource(addResourceInput: $addResourceInput) {
    id
    category
    label
    schedule {
      mon {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      tue {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      wed {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      thu {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      fri {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sat {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sun {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      overriddenDates {
        isoDate
        schedule {
          start
          end
          slotIntervalMinutes
          slotDurationMinutes
        }
      }
    }
    seats
    enabled
  }
}
    `;
export type AddResourceMutationFn = Apollo.MutationFunction<AddResourceMutation, AddResourceMutationVariables>;

/**
 * __useAddResourceMutation__
 *
 * To run a mutation, you first call `useAddResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addResourceMutation, { data, loading, error }] = useAddResourceMutation({
 *   variables: {
 *      addResourceInput: // value for 'addResourceInput'
 *   },
 * });
 */
export function useAddResourceMutation(baseOptions?: Apollo.MutationHookOptions<AddResourceMutation, AddResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddResourceMutation, AddResourceMutationVariables>(AddResourceDocument, options);
      }
export type AddResourceMutationHookResult = ReturnType<typeof useAddResourceMutation>;
export type AddResourceMutationResult = Apollo.MutationResult<AddResourceMutation>;
export type AddResourceMutationOptions = Apollo.BaseMutationOptions<AddResourceMutation, AddResourceMutationVariables>;
export const AddSigningKeyDocument = gql`
    mutation addSigningKey($key: String!, $customerId: String) {
  addSigningKey(key: $key, customerId: $customerId) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;
export type AddSigningKeyMutationFn = Apollo.MutationFunction<AddSigningKeyMutation, AddSigningKeyMutationVariables>;

/**
 * __useAddSigningKeyMutation__
 *
 * To run a mutation, you first call `useAddSigningKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSigningKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSigningKeyMutation, { data, loading, error }] = useAddSigningKeyMutation({
 *   variables: {
 *      key: // value for 'key'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useAddSigningKeyMutation(baseOptions?: Apollo.MutationHookOptions<AddSigningKeyMutation, AddSigningKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSigningKeyMutation, AddSigningKeyMutationVariables>(AddSigningKeyDocument, options);
      }
export type AddSigningKeyMutationHookResult = ReturnType<typeof useAddSigningKeyMutation>;
export type AddSigningKeyMutationResult = Apollo.MutationResult<AddSigningKeyMutation>;
export type AddSigningKeyMutationOptions = Apollo.BaseMutationOptions<AddSigningKeyMutation, AddSigningKeyMutationVariables>;
export const CancelBookingDocument = gql`
    mutation cancelBooking($id: String!) {
  cancelBooking(id: $id) {
    id
    userId
    resourceId
    start
    end
    canceled
    comment
    seatNumber
  }
}
    `;
export type CancelBookingMutationFn = Apollo.MutationFunction<CancelBookingMutation, CancelBookingMutationVariables>;

/**
 * __useCancelBookingMutation__
 *
 * To run a mutation, you first call `useCancelBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelBookingMutation, { data, loading, error }] = useCancelBookingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelBookingMutation(baseOptions?: Apollo.MutationHookOptions<CancelBookingMutation, CancelBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelBookingMutation, CancelBookingMutationVariables>(CancelBookingDocument, options);
      }
export type CancelBookingMutationHookResult = ReturnType<typeof useCancelBookingMutation>;
export type CancelBookingMutationResult = Apollo.MutationResult<CancelBookingMutation>;
export type CancelBookingMutationOptions = Apollo.BaseMutationOptions<CancelBookingMutation, CancelBookingMutationVariables>;
export const DeleteCustomerDocument = gql`
    mutation deleteCustomer($id: String!) {
  deleteCustomer(id: $id) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;
export type DeleteCustomerMutationFn = Apollo.MutationFunction<DeleteCustomerMutation, DeleteCustomerMutationVariables>;

/**
 * __useDeleteCustomerMutation__
 *
 * To run a mutation, you first call `useDeleteCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomerMutation, { data, loading, error }] = useDeleteCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCustomerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCustomerMutation, DeleteCustomerMutationVariables>(DeleteCustomerDocument, options);
      }
export type DeleteCustomerMutationHookResult = ReturnType<typeof useDeleteCustomerMutation>;
export type DeleteCustomerMutationResult = Apollo.MutationResult<DeleteCustomerMutation>;
export type DeleteCustomerMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const DeleteSigningKeyDocument = gql`
    mutation deleteSigningKey($key: String!, $customerId: String) {
  deleteSigningKey(key: $key, customerId: $customerId) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;
export type DeleteSigningKeyMutationFn = Apollo.MutationFunction<DeleteSigningKeyMutation, DeleteSigningKeyMutationVariables>;

/**
 * __useDeleteSigningKeyMutation__
 *
 * To run a mutation, you first call `useDeleteSigningKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSigningKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSigningKeyMutation, { data, loading, error }] = useDeleteSigningKeyMutation({
 *   variables: {
 *      key: // value for 'key'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useDeleteSigningKeyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSigningKeyMutation, DeleteSigningKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSigningKeyMutation, DeleteSigningKeyMutationVariables>(DeleteSigningKeyDocument, options);
      }
export type DeleteSigningKeyMutationHookResult = ReturnType<typeof useDeleteSigningKeyMutation>;
export type DeleteSigningKeyMutationResult = Apollo.MutationResult<DeleteSigningKeyMutation>;
export type DeleteSigningKeyMutationOptions = Apollo.BaseMutationOptions<DeleteSigningKeyMutation, DeleteSigningKeyMutationVariables>;
export const DisableCustomerDocument = gql`
    mutation disableCustomer($id: String!) {
  disableCustomer(id: $id) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;
export type DisableCustomerMutationFn = Apollo.MutationFunction<DisableCustomerMutation, DisableCustomerMutationVariables>;

/**
 * __useDisableCustomerMutation__
 *
 * To run a mutation, you first call `useDisableCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableCustomerMutation, { data, loading, error }] = useDisableCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDisableCustomerMutation(baseOptions?: Apollo.MutationHookOptions<DisableCustomerMutation, DisableCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DisableCustomerMutation, DisableCustomerMutationVariables>(DisableCustomerDocument, options);
      }
export type DisableCustomerMutationHookResult = ReturnType<typeof useDisableCustomerMutation>;
export type DisableCustomerMutationResult = Apollo.MutationResult<DisableCustomerMutation>;
export type DisableCustomerMutationOptions = Apollo.BaseMutationOptions<DisableCustomerMutation, DisableCustomerMutationVariables>;
export const DisableResourceDocument = gql`
    mutation disableResource($id: String!) {
  disableResource(id: $id) {
    id
    category
    label
    schedule {
      mon {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      tue {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      wed {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      thu {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      fri {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sat {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sun {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      overriddenDates {
        isoDate
        schedule {
          start
          end
          slotIntervalMinutes
          slotDurationMinutes
        }
      }
    }
    seats
    enabled
  }
}
    `;
export type DisableResourceMutationFn = Apollo.MutationFunction<DisableResourceMutation, DisableResourceMutationVariables>;

/**
 * __useDisableResourceMutation__
 *
 * To run a mutation, you first call `useDisableResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableResourceMutation, { data, loading, error }] = useDisableResourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDisableResourceMutation(baseOptions?: Apollo.MutationHookOptions<DisableResourceMutation, DisableResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DisableResourceMutation, DisableResourceMutationVariables>(DisableResourceDocument, options);
      }
export type DisableResourceMutationHookResult = ReturnType<typeof useDisableResourceMutation>;
export type DisableResourceMutationResult = Apollo.MutationResult<DisableResourceMutation>;
export type DisableResourceMutationOptions = Apollo.BaseMutationOptions<DisableResourceMutation, DisableResourceMutationVariables>;
export const SetBookingCommentDocument = gql`
    mutation setBookingComment($id: String!, $comment: String) {
  setBookingComment(id: $id, comment: $comment) {
    id
    userId
    resourceId
    start
    end
    canceled
    comment
    seatNumber
  }
}
    `;
export type SetBookingCommentMutationFn = Apollo.MutationFunction<SetBookingCommentMutation, SetBookingCommentMutationVariables>;

/**
 * __useSetBookingCommentMutation__
 *
 * To run a mutation, you first call `useSetBookingCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetBookingCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setBookingCommentMutation, { data, loading, error }] = useSetBookingCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useSetBookingCommentMutation(baseOptions?: Apollo.MutationHookOptions<SetBookingCommentMutation, SetBookingCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetBookingCommentMutation, SetBookingCommentMutationVariables>(SetBookingCommentDocument, options);
      }
export type SetBookingCommentMutationHookResult = ReturnType<typeof useSetBookingCommentMutation>;
export type SetBookingCommentMutationResult = Apollo.MutationResult<SetBookingCommentMutation>;
export type SetBookingCommentMutationOptions = Apollo.BaseMutationOptions<SetBookingCommentMutation, SetBookingCommentMutationVariables>;
export const UpdateCustomerDocument = gql`
    mutation updateCustomer($updateCustomerInput: UpdateCustomerInput!) {
  updateCustomer(updateCustomerInput: $updateCustomerInput) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      updateCustomerInput: // value for 'updateCustomerInput'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const UpdateResourceDocument = gql`
    mutation updateResource($updateResourceInput: UpdateResourceInput!) {
  updateResource(updateResourceInput: $updateResourceInput) {
    id
    category
    label
    schedule {
      mon {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      tue {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      wed {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      thu {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      fri {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sat {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sun {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      overriddenDates {
        isoDate
        schedule {
          start
          end
          slotIntervalMinutes
          slotDurationMinutes
        }
      }
    }
    seats
    enabled
  }
}
    `;
export type UpdateResourceMutationFn = Apollo.MutationFunction<UpdateResourceMutation, UpdateResourceMutationVariables>;

/**
 * __useUpdateResourceMutation__
 *
 * To run a mutation, you first call `useUpdateResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateResourceMutation, { data, loading, error }] = useUpdateResourceMutation({
 *   variables: {
 *      updateResourceInput: // value for 'updateResourceInput'
 *   },
 * });
 */
export function useUpdateResourceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateResourceMutation, UpdateResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateResourceMutation, UpdateResourceMutationVariables>(UpdateResourceDocument, options);
      }
export type UpdateResourceMutationHookResult = ReturnType<typeof useUpdateResourceMutation>;
export type UpdateResourceMutationResult = Apollo.MutationResult<UpdateResourceMutation>;
export type UpdateResourceMutationOptions = Apollo.BaseMutationOptions<UpdateResourceMutation, UpdateResourceMutationVariables>;
export const FindAvailabilityDocument = gql`
    query findAvailability($filterAvailability: FindAvailabilityInput!) {
  findAvailability(filterAvailability: $filterAvailability) {
    availableSeats
    start
    end
  }
}
    `;

/**
 * __useFindAvailabilityQuery__
 *
 * To run a query within a React component, call `useFindAvailabilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAvailabilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAvailabilityQuery({
 *   variables: {
 *      filterAvailability: // value for 'filterAvailability'
 *   },
 * });
 */
export function useFindAvailabilityQuery(baseOptions: Apollo.QueryHookOptions<FindAvailabilityQuery, FindAvailabilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAvailabilityQuery, FindAvailabilityQueryVariables>(FindAvailabilityDocument, options);
      }
export function useFindAvailabilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAvailabilityQuery, FindAvailabilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAvailabilityQuery, FindAvailabilityQueryVariables>(FindAvailabilityDocument, options);
        }
export type FindAvailabilityQueryHookResult = ReturnType<typeof useFindAvailabilityQuery>;
export type FindAvailabilityLazyQueryHookResult = ReturnType<typeof useFindAvailabilityLazyQuery>;
export type FindAvailabilityQueryResult = Apollo.QueryResult<FindAvailabilityQuery, FindAvailabilityQueryVariables>;
export const FindBookingsDocument = gql`
    query findBookings($filterBookings: FindBookingInput!) {
  findBookings(filterBookings: $filterBookings) {
    id
    userId
    resourceId
    start
    end
    canceled
    comment
    seatNumber
  }
}
    `;

/**
 * __useFindBookingsQuery__
 *
 * To run a query within a React component, call `useFindBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindBookingsQuery({
 *   variables: {
 *      filterBookings: // value for 'filterBookings'
 *   },
 * });
 */
export function useFindBookingsQuery(baseOptions: Apollo.QueryHookOptions<FindBookingsQuery, FindBookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindBookingsQuery, FindBookingsQueryVariables>(FindBookingsDocument, options);
      }
export function useFindBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindBookingsQuery, FindBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindBookingsQuery, FindBookingsQueryVariables>(FindBookingsDocument, options);
        }
export type FindBookingsQueryHookResult = ReturnType<typeof useFindBookingsQuery>;
export type FindBookingsLazyQueryHookResult = ReturnType<typeof useFindBookingsLazyQuery>;
export type FindBookingsQueryResult = Apollo.QueryResult<FindBookingsQuery, FindBookingsQueryVariables>;
export const FindResourcesDocument = gql`
    query findResources($filterResource: FindResourceInput!) {
  findResources(filterResource: $filterResource) {
    id
    category
    label
    schedule {
      mon {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      tue {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      wed {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      thu {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      fri {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sat {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sun {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      overriddenDates {
        isoDate
        schedule {
          start
          end
          slotIntervalMinutes
          slotDurationMinutes
        }
      }
    }
    seats
    enabled
  }
}
    `;

/**
 * __useFindResourcesQuery__
 *
 * To run a query within a React component, call `useFindResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindResourcesQuery({
 *   variables: {
 *      filterResource: // value for 'filterResource'
 *   },
 * });
 */
export function useFindResourcesQuery(baseOptions: Apollo.QueryHookOptions<FindResourcesQuery, FindResourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindResourcesQuery, FindResourcesQueryVariables>(FindResourcesDocument, options);
      }
export function useFindResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindResourcesQuery, FindResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindResourcesQuery, FindResourcesQueryVariables>(FindResourcesDocument, options);
        }
export type FindResourcesQueryHookResult = ReturnType<typeof useFindResourcesQuery>;
export type FindResourcesLazyQueryHookResult = ReturnType<typeof useFindResourcesLazyQuery>;
export type FindResourcesQueryResult = Apollo.QueryResult<FindResourcesQuery, FindResourcesQueryVariables>;
export const GetBookedDurationDocument = gql`
    query getBookedDuration($filterBookings: FindBookingInput!) {
  getBookedDuration(filterBookings: $filterBookings) {
    minutes
    bookingIds
    numBookings
  }
}
    `;

/**
 * __useGetBookedDurationQuery__
 *
 * To run a query within a React component, call `useGetBookedDurationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookedDurationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookedDurationQuery({
 *   variables: {
 *      filterBookings: // value for 'filterBookings'
 *   },
 * });
 */
export function useGetBookedDurationQuery(baseOptions: Apollo.QueryHookOptions<GetBookedDurationQuery, GetBookedDurationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookedDurationQuery, GetBookedDurationQueryVariables>(GetBookedDurationDocument, options);
      }
export function useGetBookedDurationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookedDurationQuery, GetBookedDurationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookedDurationQuery, GetBookedDurationQueryVariables>(GetBookedDurationDocument, options);
        }
export type GetBookedDurationQueryHookResult = ReturnType<typeof useGetBookedDurationQuery>;
export type GetBookedDurationLazyQueryHookResult = ReturnType<typeof useGetBookedDurationLazyQuery>;
export type GetBookedDurationQueryResult = Apollo.QueryResult<GetBookedDurationQuery, GetBookedDurationQueryVariables>;
export const GetBookingByIdDocument = gql`
    query getBookingById($id: String!) {
  getBookingById(id: $id) {
    id
    userId
    resourceId
    start
    end
    canceled
    comment
    seatNumber
  }
}
    `;

/**
 * __useGetBookingByIdQuery__
 *
 * To run a query within a React component, call `useGetBookingByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookingByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookingByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBookingByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBookingByIdQuery, GetBookingByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookingByIdQuery, GetBookingByIdQueryVariables>(GetBookingByIdDocument, options);
      }
export function useGetBookingByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookingByIdQuery, GetBookingByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookingByIdQuery, GetBookingByIdQueryVariables>(GetBookingByIdDocument, options);
        }
export type GetBookingByIdQueryHookResult = ReturnType<typeof useGetBookingByIdQuery>;
export type GetBookingByIdLazyQueryHookResult = ReturnType<typeof useGetBookingByIdLazyQuery>;
export type GetBookingByIdQueryResult = Apollo.QueryResult<GetBookingByIdQuery, GetBookingByIdQueryVariables>;
export const GetCustomerByEmailDocument = gql`
    query getCustomerByEmail($email: String!) {
  getCustomerByEmail(email: $email) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;

/**
 * __useGetCustomerByEmailQuery__
 *
 * To run a query within a React component, call `useGetCustomerByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetCustomerByEmailQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerByEmailQuery, GetCustomerByEmailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerByEmailQuery, GetCustomerByEmailQueryVariables>(GetCustomerByEmailDocument, options);
      }
export function useGetCustomerByEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerByEmailQuery, GetCustomerByEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerByEmailQuery, GetCustomerByEmailQueryVariables>(GetCustomerByEmailDocument, options);
        }
export type GetCustomerByEmailQueryHookResult = ReturnType<typeof useGetCustomerByEmailQuery>;
export type GetCustomerByEmailLazyQueryHookResult = ReturnType<typeof useGetCustomerByEmailLazyQuery>;
export type GetCustomerByEmailQueryResult = Apollo.QueryResult<GetCustomerByEmailQuery, GetCustomerByEmailQueryVariables>;
export const GetCustomerByIdDocument = gql`
    query getCustomerById($id: String!) {
  getCustomerById(id: $id) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;

/**
 * __useGetCustomerByIdQuery__
 *
 * To run a query within a React component, call `useGetCustomerByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCustomerByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>(GetCustomerByIdDocument, options);
      }
export function useGetCustomerByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>(GetCustomerByIdDocument, options);
        }
export type GetCustomerByIdQueryHookResult = ReturnType<typeof useGetCustomerByIdQuery>;
export type GetCustomerByIdLazyQueryHookResult = ReturnType<typeof useGetCustomerByIdLazyQuery>;
export type GetCustomerByIdQueryResult = Apollo.QueryResult<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>;
export const GetCustomerByIssuerDocument = gql`
    query getCustomerByIssuer($issuer: String!) {
  getCustomerByIssuer(issuer: $issuer) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;

/**
 * __useGetCustomerByIssuerQuery__
 *
 * To run a query within a React component, call `useGetCustomerByIssuerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerByIssuerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerByIssuerQuery({
 *   variables: {
 *      issuer: // value for 'issuer'
 *   },
 * });
 */
export function useGetCustomerByIssuerQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerByIssuerQuery, GetCustomerByIssuerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerByIssuerQuery, GetCustomerByIssuerQueryVariables>(GetCustomerByIssuerDocument, options);
      }
export function useGetCustomerByIssuerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerByIssuerQuery, GetCustomerByIssuerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerByIssuerQuery, GetCustomerByIssuerQueryVariables>(GetCustomerByIssuerDocument, options);
        }
export type GetCustomerByIssuerQueryHookResult = ReturnType<typeof useGetCustomerByIssuerQuery>;
export type GetCustomerByIssuerLazyQueryHookResult = ReturnType<typeof useGetCustomerByIssuerLazyQuery>;
export type GetCustomerByIssuerQueryResult = Apollo.QueryResult<GetCustomerByIssuerQuery, GetCustomerByIssuerQueryVariables>;
export const GetLatestBookingDocument = gql`
    query getLatestBooking($filterBookings: FindBookingInput!) {
  getLatestBooking(filterBookings: $filterBookings) {
    id
    userId
    resourceId
    start
    end
    canceled
    comment
    seatNumber
  }
}
    `;

/**
 * __useGetLatestBookingQuery__
 *
 * To run a query within a React component, call `useGetLatestBookingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestBookingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestBookingQuery({
 *   variables: {
 *      filterBookings: // value for 'filterBookings'
 *   },
 * });
 */
export function useGetLatestBookingQuery(baseOptions: Apollo.QueryHookOptions<GetLatestBookingQuery, GetLatestBookingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestBookingQuery, GetLatestBookingQueryVariables>(GetLatestBookingDocument, options);
      }
export function useGetLatestBookingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestBookingQuery, GetLatestBookingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestBookingQuery, GetLatestBookingQueryVariables>(GetLatestBookingDocument, options);
        }
export type GetLatestBookingQueryHookResult = ReturnType<typeof useGetLatestBookingQuery>;
export type GetLatestBookingLazyQueryHookResult = ReturnType<typeof useGetLatestBookingLazyQuery>;
export type GetLatestBookingQueryResult = Apollo.QueryResult<GetLatestBookingQuery, GetLatestBookingQueryVariables>;
export const GetNextAvailableDocument = gql`
    query getNextAvailable($id: String!, $afterDate: Int) {
  getNextAvailable(id: $id, afterDate: $afterDate) {
    availableSeats
    start
    end
  }
}
    `;

/**
 * __useGetNextAvailableQuery__
 *
 * To run a query within a React component, call `useGetNextAvailableQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNextAvailableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNextAvailableQuery({
 *   variables: {
 *      id: // value for 'id'
 *      afterDate: // value for 'afterDate'
 *   },
 * });
 */
export function useGetNextAvailableQuery(baseOptions: Apollo.QueryHookOptions<GetNextAvailableQuery, GetNextAvailableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNextAvailableQuery, GetNextAvailableQueryVariables>(GetNextAvailableDocument, options);
      }
export function useGetNextAvailableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNextAvailableQuery, GetNextAvailableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNextAvailableQuery, GetNextAvailableQueryVariables>(GetNextAvailableDocument, options);
        }
export type GetNextAvailableQueryHookResult = ReturnType<typeof useGetNextAvailableQuery>;
export type GetNextAvailableLazyQueryHookResult = ReturnType<typeof useGetNextAvailableLazyQuery>;
export type GetNextAvailableQueryResult = Apollo.QueryResult<GetNextAvailableQuery, GetNextAvailableQueryVariables>;
export const GetResourceByIdDocument = gql`
    query getResourceById($id: String!) {
  getResourceById(id: $id) {
    id
    category
    label
    schedule {
      mon {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      tue {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      wed {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      thu {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      fri {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sat {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      sun {
        start
        end
        slotIntervalMinutes
        slotDurationMinutes
      }
      overriddenDates {
        isoDate
        schedule {
          start
          end
          slotIntervalMinutes
          slotDurationMinutes
        }
      }
    }
    seats
    enabled
  }
}
    `;

/**
 * __useGetResourceByIdQuery__
 *
 * To run a query within a React component, call `useGetResourceByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResourceByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResourceByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetResourceByIdQuery(baseOptions: Apollo.QueryHookOptions<GetResourceByIdQuery, GetResourceByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetResourceByIdQuery, GetResourceByIdQueryVariables>(GetResourceByIdDocument, options);
      }
export function useGetResourceByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetResourceByIdQuery, GetResourceByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetResourceByIdQuery, GetResourceByIdQueryVariables>(GetResourceByIdDocument, options);
        }
export type GetResourceByIdQueryHookResult = ReturnType<typeof useGetResourceByIdQuery>;
export type GetResourceByIdLazyQueryHookResult = ReturnType<typeof useGetResourceByIdLazyQuery>;
export type GetResourceByIdQueryResult = Apollo.QueryResult<GetResourceByIdQuery, GetResourceByIdQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
    publicKeys
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;