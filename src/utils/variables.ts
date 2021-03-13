import * as Handlebars from 'handlebars';

import { Variables } from '../types';

export const insertVariables = (
  html: string,
  variables: Variables,
  throwOnMissing: boolean = false
): string => {
  const template = Handlebars.compile(html, { strict: throwOnMissing });
  return template(variables);
};
