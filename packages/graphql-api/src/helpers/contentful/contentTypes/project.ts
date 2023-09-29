import { Asset } from "./asset"
import { Call } from "./call"
import { Partner } from "./partner"

export type Project = {
    contentType: 'project'
    id: string
    leadPartner?: Partner
    title: string
    body?: string
    gbifRegion: string
    createdAt: Date
    start?: Date
    end?: Date
    matchingFunds?: number
    // TODO: this must be of type programme, which is not defined yet
    programme: unknown
    primaryImage?: Asset
    fundsAllocated?: number
    officialTitle?: string
    leadContact?: string
    searchable: boolean
    contractCountry: string
    call?: Call
    gbifProgrammeAcronym: string
    projectId?: string
    additionalPartners: Partner[]
    status: string
    homepage: boolean
    keywords: string[]
    documents: Asset[]
    // TODO: this must be of type event, but it does not have all the fields of the existing event type
    // eventIds: string[]
}