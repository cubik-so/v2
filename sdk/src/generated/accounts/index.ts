export * from "./Admin";
export * from "./Event";
export * from "./EventJoin";
export * from "./Project";
export * from "./Sponsor";
export * from "./User";

import { Admin } from "./Admin";
import { EventJoin } from "./EventJoin";
import { Event } from "./Event";
import { Project } from "./Project";
import { Sponsor } from "./Sponsor";
import { User } from "./User";

export const accountProviders = {
  Admin,
  EventJoin,
  Event,
  Project,
  Sponsor,
  User,
};
