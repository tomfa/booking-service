INSERT INTO CUSTOMER (id, name, email, issuer) VALUES ('kroloftet-free', 'Torbjørn Larssen', 'torbjorn@kroloftet.no', 'auth.kroloftet.no');
INSERT INTO RESOURCE (id, "customerId", label, seats, schedule) VALUES ('kroloftet-møterom', 'kroloftet-free', 'Møterom', 4, '{
  "mon": { "start": "08:00", "end": "20:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "tue": { "start": "08:00", "end": "20:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "wed": { "start": "08:00", "end": "20:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "thu": { "start": "08:00", "end": "20:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "fri": { "start": "08:00", "end": "20:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "sat": { "start": "10:00", "end": "16:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "sun": { "start": "10:00", "end": "16:00", "slotDurationMinutes": 60, "slotIntervalMinutes": 30 },
  "overriddenDates": []
}');
INSERT INTO BOOKING (
  id,
  "customerId",
  "userId",
  "resourceId",
  "startTime",
  "endTime",
  "seatNumber"
) VALUES (
  'kroloftet-booking-1',
  'kroloftet-free',
  '3',
  'kroloftet-møterom',
  '2021-06-15 10:00:00',
  '2021-06-15 10:30:00',
  0
);
