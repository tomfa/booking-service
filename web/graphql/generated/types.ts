import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
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
  customerId?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
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
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
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
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
  )> }
);

export type DisableCustomerMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DisableCustomerMutation = (
  { __typename?: 'Mutation' }
  & { disableCustomer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
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
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
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
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
  )> }
);

export type GetCustomerByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetCustomerByIdQuery = (
  { __typename?: 'Query' }
  & { getCustomerById?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
  )> }
);

export type GetCustomerByIssuerQueryVariables = Exact<{
  issuer: Scalars['String'];
}>;


export type GetCustomerByIssuerQuery = (
  { __typename?: 'Query' }
  & { getCustomerByIssuer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'email' | 'phoneNumber' | 'issuer' | 'credits' | 'enabled'>
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


export const AddBookingDocument = `
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
export const useAddBookingMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<AddBookingMutation, TError, AddBookingMutationVariables, TContext>
    ) => 
    useMutation<AddBookingMutation, TError, AddBookingMutationVariables, TContext>(
      (variables?: AddBookingMutationVariables) => fetcher<AddBookingMutation, AddBookingMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AddBookingDocument, variables)(),
      options
    );
export const AddCustomerDocument = `
    mutation addCustomer($addCustomerInput: AddCustomerInput!) {
  addCustomer(addCustomerInput: $addCustomerInput) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useAddCustomerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<AddCustomerMutation, TError, AddCustomerMutationVariables, TContext>
    ) => 
    useMutation<AddCustomerMutation, TError, AddCustomerMutationVariables, TContext>(
      (variables?: AddCustomerMutationVariables) => fetcher<AddCustomerMutation, AddCustomerMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AddCustomerDocument, variables)(),
      options
    );
export const AddResourceDocument = `
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
export const useAddResourceMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<AddResourceMutation, TError, AddResourceMutationVariables, TContext>
    ) => 
    useMutation<AddResourceMutation, TError, AddResourceMutationVariables, TContext>(
      (variables?: AddResourceMutationVariables) => fetcher<AddResourceMutation, AddResourceMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AddResourceDocument, variables)(),
      options
    );
export const CancelBookingDocument = `
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
export const useCancelBookingMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<CancelBookingMutation, TError, CancelBookingMutationVariables, TContext>
    ) => 
    useMutation<CancelBookingMutation, TError, CancelBookingMutationVariables, TContext>(
      (variables?: CancelBookingMutationVariables) => fetcher<CancelBookingMutation, CancelBookingMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CancelBookingDocument, variables)(),
      options
    );
export const DeleteCustomerDocument = `
    mutation deleteCustomer($id: String!) {
  deleteCustomer(id: $id) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useDeleteCustomerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<DeleteCustomerMutation, TError, DeleteCustomerMutationVariables, TContext>
    ) => 
    useMutation<DeleteCustomerMutation, TError, DeleteCustomerMutationVariables, TContext>(
      (variables?: DeleteCustomerMutationVariables) => fetcher<DeleteCustomerMutation, DeleteCustomerMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteCustomerDocument, variables)(),
      options
    );
export const DisableCustomerDocument = `
    mutation disableCustomer($id: String!) {
  disableCustomer(id: $id) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useDisableCustomerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<DisableCustomerMutation, TError, DisableCustomerMutationVariables, TContext>
    ) => 
    useMutation<DisableCustomerMutation, TError, DisableCustomerMutationVariables, TContext>(
      (variables?: DisableCustomerMutationVariables) => fetcher<DisableCustomerMutation, DisableCustomerMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DisableCustomerDocument, variables)(),
      options
    );
export const DisableResourceDocument = `
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
export const useDisableResourceMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<DisableResourceMutation, TError, DisableResourceMutationVariables, TContext>
    ) => 
    useMutation<DisableResourceMutation, TError, DisableResourceMutationVariables, TContext>(
      (variables?: DisableResourceMutationVariables) => fetcher<DisableResourceMutation, DisableResourceMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DisableResourceDocument, variables)(),
      options
    );
export const SetBookingCommentDocument = `
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
export const useSetBookingCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<SetBookingCommentMutation, TError, SetBookingCommentMutationVariables, TContext>
    ) => 
    useMutation<SetBookingCommentMutation, TError, SetBookingCommentMutationVariables, TContext>(
      (variables?: SetBookingCommentMutationVariables) => fetcher<SetBookingCommentMutation, SetBookingCommentMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, SetBookingCommentDocument, variables)(),
      options
    );
export const UpdateCustomerDocument = `
    mutation updateCustomer($updateCustomerInput: UpdateCustomerInput!) {
  updateCustomer(updateCustomerInput: $updateCustomerInput) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useUpdateCustomerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<UpdateCustomerMutation, TError, UpdateCustomerMutationVariables, TContext>
    ) => 
    useMutation<UpdateCustomerMutation, TError, UpdateCustomerMutationVariables, TContext>(
      (variables?: UpdateCustomerMutationVariables) => fetcher<UpdateCustomerMutation, UpdateCustomerMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateCustomerDocument, variables)(),
      options
    );
export const UpdateResourceDocument = `
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
export const useUpdateResourceMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<UpdateResourceMutation, TError, UpdateResourceMutationVariables, TContext>
    ) => 
    useMutation<UpdateResourceMutation, TError, UpdateResourceMutationVariables, TContext>(
      (variables?: UpdateResourceMutationVariables) => fetcher<UpdateResourceMutation, UpdateResourceMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateResourceDocument, variables)(),
      options
    );
export const FindAvailabilityDocument = `
    query findAvailability($filterAvailability: FindAvailabilityInput!) {
  findAvailability(filterAvailability: $filterAvailability) {
    availableSeats
    start
    end
  }
}
    `;
export const useFindAvailabilityQuery = <
      TData = FindAvailabilityQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: FindAvailabilityQueryVariables, 
      options?: UseQueryOptions<FindAvailabilityQuery, TError, TData>
    ) => 
    useQuery<FindAvailabilityQuery, TError, TData>(
      ['findAvailability', variables],
      fetcher<FindAvailabilityQuery, FindAvailabilityQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FindAvailabilityDocument, variables),
      options
    );
export const FindBookingsDocument = `
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
export const useFindBookingsQuery = <
      TData = FindBookingsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: FindBookingsQueryVariables, 
      options?: UseQueryOptions<FindBookingsQuery, TError, TData>
    ) => 
    useQuery<FindBookingsQuery, TError, TData>(
      ['findBookings', variables],
      fetcher<FindBookingsQuery, FindBookingsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FindBookingsDocument, variables),
      options
    );
export const FindResourcesDocument = `
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
export const useFindResourcesQuery = <
      TData = FindResourcesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: FindResourcesQueryVariables, 
      options?: UseQueryOptions<FindResourcesQuery, TError, TData>
    ) => 
    useQuery<FindResourcesQuery, TError, TData>(
      ['findResources', variables],
      fetcher<FindResourcesQuery, FindResourcesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FindResourcesDocument, variables),
      options
    );
export const GetBookedDurationDocument = `
    query getBookedDuration($filterBookings: FindBookingInput!) {
  getBookedDuration(filterBookings: $filterBookings) {
    minutes
    bookingIds
    numBookings
  }
}
    `;
export const useGetBookedDurationQuery = <
      TData = GetBookedDurationQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetBookedDurationQueryVariables, 
      options?: UseQueryOptions<GetBookedDurationQuery, TError, TData>
    ) => 
    useQuery<GetBookedDurationQuery, TError, TData>(
      ['getBookedDuration', variables],
      fetcher<GetBookedDurationQuery, GetBookedDurationQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetBookedDurationDocument, variables),
      options
    );
export const GetBookingByIdDocument = `
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
export const useGetBookingByIdQuery = <
      TData = GetBookingByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetBookingByIdQueryVariables, 
      options?: UseQueryOptions<GetBookingByIdQuery, TError, TData>
    ) => 
    useQuery<GetBookingByIdQuery, TError, TData>(
      ['getBookingById', variables],
      fetcher<GetBookingByIdQuery, GetBookingByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetBookingByIdDocument, variables),
      options
    );
export const GetCustomerByEmailDocument = `
    query getCustomerByEmail($email: String!) {
  getCustomerByEmail(email: $email) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useGetCustomerByEmailQuery = <
      TData = GetCustomerByEmailQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetCustomerByEmailQueryVariables, 
      options?: UseQueryOptions<GetCustomerByEmailQuery, TError, TData>
    ) => 
    useQuery<GetCustomerByEmailQuery, TError, TData>(
      ['getCustomerByEmail', variables],
      fetcher<GetCustomerByEmailQuery, GetCustomerByEmailQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetCustomerByEmailDocument, variables),
      options
    );
export const GetCustomerByIdDocument = `
    query getCustomerById($id: String!) {
  getCustomerById(id: $id) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useGetCustomerByIdQuery = <
      TData = GetCustomerByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetCustomerByIdQueryVariables, 
      options?: UseQueryOptions<GetCustomerByIdQuery, TError, TData>
    ) => 
    useQuery<GetCustomerByIdQuery, TError, TData>(
      ['getCustomerById', variables],
      fetcher<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetCustomerByIdDocument, variables),
      options
    );
export const GetCustomerByIssuerDocument = `
    query getCustomerByIssuer($issuer: String!) {
  getCustomerByIssuer(issuer: $issuer) {
    id
    name
    email
    phoneNumber
    issuer
    credits
    enabled
  }
}
    `;
export const useGetCustomerByIssuerQuery = <
      TData = GetCustomerByIssuerQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetCustomerByIssuerQueryVariables, 
      options?: UseQueryOptions<GetCustomerByIssuerQuery, TError, TData>
    ) => 
    useQuery<GetCustomerByIssuerQuery, TError, TData>(
      ['getCustomerByIssuer', variables],
      fetcher<GetCustomerByIssuerQuery, GetCustomerByIssuerQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetCustomerByIssuerDocument, variables),
      options
    );
export const GetLatestBookingDocument = `
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
export const useGetLatestBookingQuery = <
      TData = GetLatestBookingQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetLatestBookingQueryVariables, 
      options?: UseQueryOptions<GetLatestBookingQuery, TError, TData>
    ) => 
    useQuery<GetLatestBookingQuery, TError, TData>(
      ['getLatestBooking', variables],
      fetcher<GetLatestBookingQuery, GetLatestBookingQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetLatestBookingDocument, variables),
      options
    );
export const GetNextAvailableDocument = `
    query getNextAvailable($id: String!, $afterDate: Int) {
  getNextAvailable(id: $id, afterDate: $afterDate) {
    availableSeats
    start
    end
  }
}
    `;
export const useGetNextAvailableQuery = <
      TData = GetNextAvailableQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetNextAvailableQueryVariables, 
      options?: UseQueryOptions<GetNextAvailableQuery, TError, TData>
    ) => 
    useQuery<GetNextAvailableQuery, TError, TData>(
      ['getNextAvailable', variables],
      fetcher<GetNextAvailableQuery, GetNextAvailableQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetNextAvailableDocument, variables),
      options
    );
export const GetResourceByIdDocument = `
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
export const useGetResourceByIdQuery = <
      TData = GetResourceByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: GetResourceByIdQueryVariables, 
      options?: UseQueryOptions<GetResourceByIdQuery, TError, TData>
    ) => 
    useQuery<GetResourceByIdQuery, TError, TData>(
      ['getResourceById', variables],
      fetcher<GetResourceByIdQuery, GetResourceByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetResourceByIdDocument, variables),
      options
    );