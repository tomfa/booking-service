# vailable

> Booking is tough. Make it easy!

### Prerequisite

You'll need an account set up at [vailable.eu](https://vailable.eu) 

## Install

```
yarn add vailable

# or with npm

npm install vailable
```

## Basic usage from Node 

```ts
import Booking from 'vailable';

const API = new Booking({ 
  apiKey: 'your-secret-api-key' 
});

// See docs below on adding resources
const resourceId = 'resource-id';
const userId = 'freely-selectable-id';
const newBooking = await API.addBooking({
  userId,
  resourceId,  
  start: new Date('2021-05-17T13:30:00Z'),
  end: new Date('2021-05-17T14:30:00Z'),
  canceled: false,  
});

const bookings = await API.findBookings({ 
  userId: 'my-user-id' 
})

// bookings.length === 1
// bookings[0].id === newBooking.id
```


### Add resource

```ts
import { types } from 'vailalbe';

const resource = await API.addResource({
  label: 'My first Spa',
  schedule: schedule,
  seats: 12,
  enabled: true,
})

// 1 hour long sessions, bookable at 08:00, 08:30, 09:00, ..., 19:30 
const schedule: types.Schedule = {
  mon: ({ start: '08:00', end: '20:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
  tue: ({ start: '08:00', end: '20:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
  wed: ({ start: '08:00', end: '20:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
  thu: ({ start: '08:00', end: '20:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
  fri: ({ start: '08:00', end: '20:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
  sat: ({ start: '10:00', end: '16:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
  sun: ({ start: '10:00', end: '16:00', slotDurationMinutes: 60, slotDurationInterval: 30 }),
}
```
