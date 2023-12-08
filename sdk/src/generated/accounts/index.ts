export * from './Admin'
export * from './Event'
export * from './EventJoin'
export * from './Project'
export * from './Sponsor'
export * from './SponsorTeam'
export * from './SubAdmin'
export * from './User'

import { Admin } from './Admin'
import { SubAdmin } from './SubAdmin'
import { EventJoin } from './EventJoin'
import { Event } from './Event'
import { Project } from './Project'
import { SponsorTeam } from './SponsorTeam'
import { Sponsor } from './Sponsor'
import { User } from './User'

export const accountProviders = {
  Admin,
  SubAdmin,
  EventJoin,
  Event,
  Project,
  SponsorTeam,
  Sponsor,
  User,
}
