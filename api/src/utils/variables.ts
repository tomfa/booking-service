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

export const cleanVariables = (variablesFromQuery: unknown): Variables => {
  return variablesFromQuery as Variables;
};
