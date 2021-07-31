import createApp from './app';
import { createJWTtoken } from './lambda/utils/token';

createApp();

const token = createJWTtoken('tomas');

console.log('Token for testing');
console.log(token);
