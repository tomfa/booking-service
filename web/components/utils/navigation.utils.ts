export type NavLinkData = {
  name: string;
  href?: string | false;
  current?: boolean;
};

export const getBreadcrumbs = (path: string): Array<NavLinkData> => {
  const navlinks: Array<NavLinkData> = [];
  const urlSplit = path
    .split('/')
    .map(x => x.trim())
    .filter(x => !!x);
  if (urlSplit.length === 0) {
    return [];
  }
  if (urlSplit[0] === 'bookings') {
    if (urlSplit.length === 2) {
      const bookingId = urlSplit[1];
      return [
        {
          name: 'Bookings',
        },
        {
          href: Route.booking({ bookingId }),
          name: bookingId,
          current: true,
        },
      ];
    }
  } else if (urlSplit[0] === 'resources') {
    let isLast = urlSplit.length === 1;
    navlinks.push({
      href: Route.resources(),
      name: 'Resources',
      current: isLast,
    });
    if (isLast) {
      return navlinks;
    }

    isLast = urlSplit.length === 2;
    if (urlSplit[1] === 'add') {
      navlinks.push({
        href: Route.addResource(),
        name: 'Add new',
        current: isLast,
      });
      return navlinks;
    }
    const resourceId = urlSplit[1];
    navlinks.push({
      href: Route.resources(urlSplit[1]),
      name: resourceId,
      current: isLast,
    });
    if (isLast) {
      return navlinks;
    }

    isLast = urlSplit.length === 3;
    const resourceAction = urlSplit[2];
    if (resourceAction === 'edit') {
      navlinks.push({
        href: Route.editResource(resourceId),
        name: `Edit`,
        current: isLast,
      });
    } else if (resourceAction === 'bookings') {
      navlinks.push({
        href: Route.listBookings({ resourceId }),
        name: `Bookings`,
        current: isLast,
      });
    } else {
      throw new Error(`Unhandled path ${path}`);
    }
    if (isLast) {
      return navlinks;
    }

    isLast = urlSplit.length === 4;
    if (urlSplit[3] === 'add') {
      navlinks.push({
        href: Route.addBooking({ resourceId }),
        name: `Add new`,
        current: isLast,
      });
    } else {
      navlinks.push({
        href: Route.booking({ resourceId, bookingId: urlSplit[3] }),
        name: urlSplit[3],
        current: isLast,
      });
    }
    if (isLast) {
      return navlinks;
    }
    throw new Error(`Unhandled path ${path}`);
  } else {
    throw new Error(`Unhandled path ${path}`);
  }
  return navlinks;
};

export const Route = {
  resources: (id?: string) => {
    if (!id) {
      return `/resources`;
    }
    return `/resources/${id}`;
  },
  editResource: (id: string) => {
    return `/resources/${id}/edit`;
  },
  addResource: () => {
    return `/resources/add`;
  },
  addBooking: ({ resourceId }: { resourceId: string }) => {
    return `/resources/${resourceId}/bookings/add`;
  },
  listBookings: ({ resourceId }: { resourceId: string }) => {
    return `/resources/${resourceId}/bookings`;
  },
  booking: ({
    bookingId,
    resourceId,
  }: {
    bookingId: string;
    resourceId?: string;
  }) => {
    if (!resourceId) {
      return `/bookings/${bookingId}`;
    }
    return `/resources/${resourceId}/bookings/${bookingId}`;
  },
};
