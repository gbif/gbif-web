import { z } from "zod";
import { pickLanguage } from "../languages";
import { DateAsStringSchema } from "../utils";
import { Mapper, PartnerSchema, localized, parseElasticSearchPartnerDTO } from "./_shared";
import { Asset, AssetDTOSchema, parseAssetDTO } from "./asset";
import { Call, CallDTOSchema, parseCallDTO } from "./call";
import { LinkDTOSchema } from "./link";

export const projectContentType = 'project';

export type Project = {
    contentType: typeof projectContentType,
    id: string
    leadPartner?: any
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
    // TODO
    additionalPartners: any[]
    status: string
    homepage: boolean
    keywords: string[]
    documents: Asset[]
    // TODO: this must be of type event, but it does not have all the fields of the existing event type
    // eventIds: string[]
}

export const ProjectDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    primaryImage: AssetDTOSchema.optional(),
    primaryLink: LinkDTOSchema.optional(),
    secondaryLinks: z.array(LinkDTOSchema).optional(),
    officialTitle: z.string().optional(),
    projectId: z.string().optional(),
    status: z.string(),
    grantType: z.string().optional(),
    start: DateAsStringSchema.optional(),
    end: DateAsStringSchema.optional(),
    fundsAllocated: z.number().int().optional(),
    matchingFunds: z.number().int().optional(),
    // TODO: This must be of type programme, which is not defined yet
    programme: z.unknown(),
    // TODO: Inspect the call type to see if i have missed any fields
    call: CallDTOSchema.optional(),
    documents: z.array(AssetDTOSchema).optional(),
    // TODO: List of Participant and/or Organisation
    fundingOrganisations: z.unknown().optional(),
    // TODO: List of News
    news: z.unknown().optional(),
    // TODO: List of Event
    events: z.unknown().optional(),
    // TODO: Participant or Organisation
    leadPartner: PartnerSchema.optional(),
    // TODO: List of Participant or Organisation
    additionalPartners: z.array(PartnerSchema).optional(),
    leadContact: z.string().optional(),
    purposes: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
    homepage: z.boolean(),
    // TODO: This is a Country link. It is maybe converted to a single string in elastic search
    contractCountry: z.string(),
    // TODO: Optional Organisation
    overrideProgrammeFunding: z.unknown().optional(),

    // Fields that are comming directly from ElasticSearch
    gbifRegion: z.string(),
    createdAt: DateAsStringSchema,
    gbifProgrammeAcronym: z.string(),
})

export function parseProjectDTO(dto: z.infer<typeof ProjectDTOSchema>, language?: string): Project {
    return {
        contentType: projectContentType,
        id: dto.id,
        leadPartner: dto.leadPartner == null ? undefined : parseElasticSearchPartnerDTO(dto.leadPartner, language),
        title: pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        gbifRegion: dto.gbifRegion,
        createdAt: dto.createdAt,
        end: dto.end,
        matchingFunds: dto.matchingFunds,
        programme: dto.programme,
        primaryImage: dto.primaryImage == null ? undefined : parseAssetDTO(dto.primaryImage),
        start: dto.start,
        fundsAllocated: dto.fundsAllocated,
        officialTitle: dto.officialTitle,
        leadContact: dto.leadContact,
        searchable: dto.searchable,
        contractCountry: dto.contractCountry,
        call: dto.call == null ? undefined : parseCallDTO(dto.call, language),
        gbifProgrammeAcronym: dto.gbifProgrammeAcronym,
        projectId: dto.projectId,
        additionalPartners: dto.additionalPartners?.map(p => parseElasticSearchPartnerDTO(p, language)) ?? [],
        status: dto.status,
        homepage: dto.homepage,
        documents: dto.documents == null ? [] : dto.documents.map(l => parseAssetDTO(l, language)),
        // eventIds: dto.events?.map(e => e.id) ?? [],
        keywords: dto.keywords ?? [],
    }
}

export const projectMapper: Mapper<Project, typeof ProjectDTOSchema> = {
    contentType: projectContentType,
    Schema: ProjectDTOSchema,
    map: parseProjectDTO,
}