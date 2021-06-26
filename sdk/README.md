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
import Vailable from 'vailable';

const API = new Vailable({
  apiKey: 'your-secret-api-key',
});

// See docs below on adding resources
const resourceId = 'resource-id';
const userId = 'freely-selectable-id';
const newBooking = await API.addBooking({
  userId,
  resourceId,
  start: new Date('2021-05-17T13:30:00Z'),
});

const bookings = await API.findBookings({
  userId: 'my-user-id',
});

// bookings.length === 1
// bookings[0].id === newBooking.id
```

### Add resource

```ts
import { types, createSchedule } from 'vailalbe';

// 1 hour long sessions, bookable at 08:00, 08:30, 09:00, ..., 19:30
const schedule = createSchedule({
  start: '08:00',
  end: '20:00',
  slotIntervalMinutes: 30,
  slotDurationMinutes: 60,
});
const resource = await API.addResource({
  label: 'My first Spa',
  schedule,
  seats: 12,
  enabled: true,
});
```
