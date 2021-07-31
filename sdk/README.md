# vailable

> Booking is tough. Make it easy!

### Prerequisite

- An account at [vailable.eu](https://vailable.eu)
- An API key pair added at [vailable.eu/profile](https://vailable.eu/profile)

## Install

```
yarn add vailable
```

## Example usage 

### Create an token (backend)

```ts
import Vailable from 'vailable';
import * as jwt from 'jsonwebtoken';

// Get these from www.vailable.eu
const secretKey = 'your-secret-key';
const accountId = 'your-account-id';

const adminToken = jwt.sign({
  iss: accountId,
  aud: ['api.vailable.eu'],
  role: 'admin', 
}, secretKey, {
  algorithm: 'RS256',
  expiresIn: '1 hour',
})

const enduserToken = jwt.sign({
  iss: accountId,
  aud: ['api.vailable.eu'],
  role: 'user', 
  sub: 'freely-selectable-id'
}, secretKey, {
  algorithm: 'RS256',
  expiresIn: '1 hour',
})

const API = new Vailable({ token: adminToken });
// Auth can also be set with API.setToken(token);
```

### Add a bookable resource
A resource must be created before adding any bookings.
This would typically be done only once, during initial setup, by an administrator.

```ts
import { createSchedule } from 'vailable';

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

### Add booking (from backend)

```ts
const userId = 'freely-selectable-string'
const newBooking = await API.addBooking({
  resourceId: resource.id,
  start: new Date('2021-05-17T13:30:00Z'),
});

const bookings = await API.findBookings({ userId });

// bookings.length === 1
// bookings[0].id === newBooking.id
```

### Add booking (from frontend)

```ts
const API = new Vailable({ token: enduserToken });

const newBooking = await API.addBooking({
  // userId is automatically set from token "sub" field
  resourceId: resource.id,
  start: new Date('2021-05-17T13:30:00Z'),
});

// user role only has access to own bookings 
const bookings = await API.findBookings();

// bookings.length === 1
// bookings[0].id === newBooking.id
```

