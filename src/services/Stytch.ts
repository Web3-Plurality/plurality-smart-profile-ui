import { StytchUIClient } from '@stytch/vanilla-js';
import { STYTCH_PUBLIC_TOKEN } from './../utils/EnvConfig';

export const stytch = new StytchUIClient(STYTCH_PUBLIC_TOKEN);
