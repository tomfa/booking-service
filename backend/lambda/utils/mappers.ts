import * as uuid from 'uuid';
import { Maybe } from '../../graphql/generated/types';

export function removeNull<T extends Record<string, unknown>>(
  args: Record<string, unknown>
): T {
  const whereInput: Record<string, unknown> = {};
  Object.entries(args).forEach(([k, v]) => {
    if (v !== null) {
      whereInput[k] = v;
    }
  });
  return whereInput as T;
}

export function getId(id: Maybe<string> | undefined): string {
  return id || uuid.v4();
}
