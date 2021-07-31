import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
export const FindAvailabilityDocument = gql`
    query findAvailability($filterAvailability: FindAvailabilityInput!) {
  findAvailability(filterAvailability: $filterAvailability) {
    availableSeats
    start
    end
  }
}
    `;
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
export const GetBookedDurationDocument = gql`
    query getBookedDuration($filterBookings: FindBookingInput!) {
  getBookedDuration(filterBookings: $filterBookings) {
    minutes
    bookingIds
    numBookings
  }
}
    `;
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
export const GetNextAvailableDocument = gql`
    query getNextAvailable($id: String!, $afterDate: Int) {
  getNextAvailable(id: $id, afterDate: $afterDate) {
    availableSeats
    start
    end
  }
}
    `;
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addBooking(variables: AddBookingMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddBookingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddBookingMutation>(AddBookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addBooking');
    },
    addCustomer(variables: AddCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCustomerMutation>(AddCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addCustomer');
    },
    addResource(variables: AddResourceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddResourceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddResourceMutation>(AddResourceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addResource');
    },
    cancelBooking(variables: CancelBookingMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CancelBookingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelBookingMutation>(CancelBookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'cancelBooking');
    },
    deleteCustomer(variables: DeleteCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCustomerMutation>(DeleteCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteCustomer');
    },
    disableCustomer(variables: DisableCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisableCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisableCustomerMutation>(DisableCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disableCustomer');
    },
    disableResource(variables: DisableResourceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisableResourceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisableResourceMutation>(DisableResourceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disableResource');
    },
    setBookingComment(variables: SetBookingCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetBookingCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetBookingCommentMutation>(SetBookingCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setBookingComment');
    },
    updateCustomer(variables: UpdateCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCustomerMutation>(UpdateCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateCustomer');
    },
    updateResource(variables: UpdateResourceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateResourceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateResourceMutation>(UpdateResourceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateResource');
    },
    findAvailability(variables: FindAvailabilityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindAvailabilityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindAvailabilityQuery>(FindAvailabilityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findAvailability');
    },
    findBookings(variables: FindBookingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindBookingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindBookingsQuery>(FindBookingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findBookings');
    },
    findResources(variables: FindResourcesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindResourcesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindResourcesQuery>(FindResourcesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findResources');
    },
    getBookedDuration(variables: GetBookedDurationQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBookedDurationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBookedDurationQuery>(GetBookedDurationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBookedDuration');
    },
    getBookingById(variables: GetBookingByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBookingByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBookingByIdQuery>(GetBookingByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBookingById');
    },
    getCustomerByEmail(variables: GetCustomerByEmailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCustomerByEmailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomerByEmailQuery>(GetCustomerByEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCustomerByEmail');
    },
    getCustomerById(variables: GetCustomerByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCustomerByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomerByIdQuery>(GetCustomerByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCustomerById');
    },
    getCustomerByIssuer(variables: GetCustomerByIssuerQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCustomerByIssuerQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomerByIssuerQuery>(GetCustomerByIssuerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCustomerByIssuer');
    },
    getLatestBooking(variables: GetLatestBookingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLatestBookingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLatestBookingQuery>(GetLatestBookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLatestBooking');
    },
    getNextAvailable(variables: GetNextAvailableQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNextAvailableQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNextAvailableQuery>(GetNextAvailableDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNextAvailable');
    },
    getResourceById(variables: GetResourceByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetResourceByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetResourceByIdQuery>(GetResourceByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getResourceById');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;