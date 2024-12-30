import {AuthenticationGuard} from "./authentication.guard";
import {AccessGuard} from "./access.guard";

/**
 * This variable contains the guard providers list to loading.
 */
export const GUARD_PROVIDERS = [
  AuthenticationGuard,
  AccessGuard
];
