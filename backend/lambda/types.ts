export type HourSchedule = {
  start: string
  end: string
  slotIntervalMinutes: number
  slotDurationMinutes: number
}
export type DateScheduleInput = {
  day: string
  start: string
  end: string
  slotIntervalMinutes: number
  slotDurationMinutes: number
}


export type DateSchedule = {
  isoDate: string
  schedule: HourSchedule
}

export type Schedule = {
  mon: HourSchedule
  tue: HourSchedule
  wed: HourSchedule
  thu: HourSchedule
  fri: HourSchedule
  sat: HourSchedule
  sun: HourSchedule
  overriddenDates: [DateSchedule]
}

export type Customer = {
  id: string
  name?: string
  email?: string
  phoneNumber?: string
  issuer: string
  credits: number
  enabled: boolean
}

export type Resource = {
  id: string
  customer: Customer
  category?: string
  label: string
  schedule: Schedule
  seats: number
  enabled: boolean
}
export type AddResourceInput = {
  id?: string
  customerId: string
  category?: string
  label: string
  seats: number
  enabled: boolean
  schedule: DateScheduleInput[]
}
export type FindResourceInput = {
  customerId?: string
  category?: string
  label?: string
  enabled?: boolean
}


export type Booking = {
  id: string
  customer: Customer
  userId: string
  resourceId: string
  start: number
  end: number
  canceled: boolean
  comment?: string
  seatNumber: number
}
export type FindBookingInput = {
  customerId?: string
  userId?: string
  resourceIds?: string[]
  from?: number
  to?: number
  includeCanceled?: boolean
}

export type AddBookingInput = {
  id: string
  customerId: string
  userId: string
  resourceId: string
  start: number
  end: number
  canceled?: boolean
  comment?: string
  seatNumber: number
}

export type TimeSlot = {
  availableSeats: number
  start: number
  end: number
}
export type FindAvailabilityInput = {
  customerId: string
  resourceIds: string[]
  from?: number
  to?: number
}

export type BookedDuration = {
  minutes: number
  bookingIds: string[]
  numBookings: number
}

export type UpdateResourceInput = {
  id: string
  category?: string
  label?: string
  seats?: number
  enabled?: boolean
  schedule: [DateScheduleInput]
}
export type AddCustomerInput = {
  id?: string
  name?: string
  email: string
  phoneNumber?: string
  issuer?: string
  credits?: number
  enabled: boolean
}

export type UpdateCustomerInput = {
  name?: string
  email: string
  phoneNumber?: string
  issuer?: string
  credits?: number
  enabled: boolean
}


export interface Query {
  getResourceById(id: string): Resource
  getBookingById(id: string): Booking
  getCustomerByIssuer(issuer: string): Customer
  getCustomerByEmail(email: string): Customer
  getCustomerById(id: string): Customer
  findResources(filterResource: FindResourceInput): [Resource]
  findBookings(filterBookings: FindBookingInput): [Booking]
  findAvailability(filterAvailability: FindAvailabilityInput): [TimeSlot]
  getNextAvailable(id: string): TimeSlot
  getLatestBooking(filterBookings: FindBookingInput): Booking
  getBookedDuration(filterBookings: FindBookingInput): BookedDuration
}

export interface Mutation {
  addResource(addResourceInput: AddResourceInput): Resource
  updateResource(input: UpdateResourceInput): Resource
  addBooking(addBookingInput: AddBookingInput): Booking
  disableResource(id: string): Resource
  cancelBooking(id: string): Booking
  addCustomer(addCustomerInput: AddCustomerInput): Customer
  disableCustomer(id: string): Customer
  updateCustomer(addCustomerInput: UpdateCustomerInput): Customer
}
