import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DynamicLink } from '@/components/dynamicLink';
import useQuery from '@/hooks/useQuery';
import { MdApps, MdCode, MdInfo } from 'react-icons/md';
import { Tabs } from '@/components/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/shadcn';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PublisherResult } from '../publisherResult';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { PaginationFooter } from '@/components/pagination';
import { NoRecords } from '@/components/noDataMessages';
import { PublisherSearchQuery, PublisherSearchQueryVariables } from '@/gql/graphql';

const PUBLISHER_SEARCH_QUERY = /* GraphQL */ `
  query PublisherSearch($offset: Int, $country: Country, $q: String, $limit: Int) {
    list: organizationSearch(country: $country, q: $q, offset: $offset, limit: $limit) {
      limit
      count
      offset
      results {
        key
        title
        created
        country
        logoUrl
        excerpt
      }
    }
  }
`;

export function PublisherSearchPage(): React.ReactElement {
  const [offset, setOffset] = useState(0);
  const tabClassName = 'g-pt-2 g-pb-1.5';
  const [filter, setFilter] = useState<{ country?: string; q?: string }>({});

  const { data, error, load, loading } = useQuery<
    PublisherSearchQuery,
    PublisherSearchQueryVariables
  >(PUBLISHER_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    load({
      variables: {
        country: filter.country,
        q: filter.q,
        limit: 20,
        offset,
      },
    });
  }, [offset, filter]);

  const publishers = data?.list;
  return (
    <>
      <Helmet>
        <title>Publisher search</title>
      </Helmet>

      <DataHeader hasBorder>
        <Tabs
          className="g-border-none"
          links={[
            {
              to: '/publisher/search',
              children: 'List',
              className: tabClassName,
            },
            {
              to: '/publisher/search/map',
              children: 'Map',
              className: tabClassName,
            },
          ]}
        />
      </DataHeader>

      <section className="">
        <div className="g-border-b g-py-2 g-px-2">
          <Input
            placeholder="Search"
            className="g-inline-block g-w-auto g-me-2 g-border-primary-500"
            onChange={(e) => setFilter({ ...filter, q: e.target.value })}
          />
          <div className="g-inline-block">
            <Select onValueChange={x => setFilter({...filter, country: x})}>
              <SelectTrigger className="g-w-[180px] g-border-primary-500">
                <SelectValue placeholder="Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
                <SelectItem value="BR">Brazil</SelectItem>
                <SelectItem value="AR">Argentina</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="CN">China</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="RU">Russia</SelectItem>
                <SelectItem value="ZA">South Africa</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="NZ">New Zealand</SelectItem>
                <SelectItem value="KR">South Korea</SelectItem>
                <SelectItem value="SG">Singapore</SelectItem>
                <SelectItem value="MY">Malaysia</SelectItem>
                <SelectItem value="TH">Thailand</SelectItem>
                <SelectItem value="VN">Vietnam</SelectItem>
                <SelectItem value="ID">Indonesia</SelectItem>
                <SelectItem value="SA">Saudi Arabia</SelectItem>
                <SelectItem value="AE">United Arab Emirates</SelectItem>
                <SelectItem value="IL">Israel</SelectItem>
                <SelectItem value="EG">Egypt</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="GH">Ghana</SelectItem>
                <SelectItem value="UG">Uganda</SelectItem>
                <SelectItem value="TZ">Tanzania</SelectItem>
                <SelectItem value="PT">Portugal</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
                <SelectItem value="SE">Sweden</SelectItem>
                <SelectItem value="NO">Norway</SelectItem>
                <SelectItem value="FI">Finland</SelectItem>
                <SelectItem value="PL">Poland</SelectItem>
                <SelectItem value="GR">Greece</SelectItem>
                <SelectItem value="TR">Turkey</SelectItem>
                <SelectItem value="IR">Iran</SelectItem>
                <SelectItem value="PK">Pakistan</SelectItem>
                <SelectItem value="BD">Bangladesh</SelectItem>
                <SelectItem value="LK">Sri Lanka</SelectItem>
                <SelectItem value="MM">Myanmar</SelectItem>
                <SelectItem value="PH">Philippines</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ArticleContainer className="g-bg-slate-100">
          <ArticleTextContainer>
            {loading && publishers?.count === 0 && (
              <>
                <NoRecords />
              </>
            )}
            {publishers && publishers.count > 0 && (
              <>
                <CardHeader id="publishers">
                  <CardTitle>
                    <FormattedMessage
                      id="counts.nPublishers"
                      values={{ total: publishers.count ?? 0 }}
                    />
                  </CardTitle>
                </CardHeader>
                {publishers &&
                  publishers.results.map((item) => (
                    <PublisherResult key={item.key} publisher={item} />
                  ))}

                {publishers?.count && publishers?.count > publishers?.limit && (
                  <PaginationFooter
                    offset={publishers.offset}
                    count={publishers.count}
                    limit={publishers.limit}
                    onChange={(x) => setOffset(x)}
                    anchor="publishers"
                  />
                )}
              </>
            )}
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

// a topbar with easy acess to the various catalogues (searchable entities). And it also works as the view navigation for search.
//
// If there is more than one catalogue enabled, then the user can switch between them.
// the catalogues will open in a drawer from the side.
// The name of the current catalogue can be shown next to the catalogue icon. It can also be hidden.

// After the catalogue selector (in the middle section), there is a place for content provided via props. This will be used to change between views (e.g. map, table, images, etc)
// And finally in the end there is room for various small action/info icons. This could be used to have a help icon, API access, DOI of the page, etc.
export function DataHeader({
  children,
  hasBorder,
}: {
  children?: React.ReactNode;
  hasBorder?: boolean;
}) {
  return (
    <div
      className={`g-flex g-justify-center g-items-center ${
        hasBorder ? 'g-border-b g-border-slate-200' : ''
      }`}
    >
      <div className="g-flex-none g-flex g-items-center g-mx-2">
        <MdApps />
        <span className="g-ms-2">Publishers</span>
      </div>
      <Separator />
      <div className="g-flex-auto">{children}</div>
      <div className="g-flex-none g-mx-2">
        <div className="g-flex g-justify-center g-text-slate-400">
          <Popup trigger={<MdInfo className="g-mx-1 hover:g-text-slate-700" />}>
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a publisher?</AccordionTrigger>
                  <AccordionContent className="g-prose g-text-sm">
                    Data is loaded from contentful help items async. E.g.
                    <HelpText
                      identifier={'which-coordinate-systems-are-used-for-gbif-occurence-downloads'}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How to search for publishers</AccordionTrigger>
                  <AccordionContent>
                    Data is loaded from contentful help items async
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Popup>
          <Popup trigger={<MdCode className="g-mx-1 hover:g-text-slate-700" />}>
            <div className="g-text-sm g-prose">
              <h3>API access</h3>
              <p>
                All data is available via the{' '}
                <a href="https://techdocs.gbif.org/en/openapi/v1/registry#/Publishing%20organizations">
                  GBIF API
                </a>
                . No registration or API key is required.
              </p>
              <p>
                Please remember to properly cite usage and to throttle requests in scripts. Most
                endpoint types support download/export. Use those if you need large data volumes.
              </p>
              <h4>Examples</h4>
              <Card className="g-p-2 g-mb-2">
                Get all publishers <br />
                <a href="https://api.gbif.org/v1/organization">
                  https://api.gbif.org/v1/organization
                </a>
              </Card>
              <Card className="g-p-2">
                First 2 German publishers with free text "animals"
                <br />
                <a href="https://api.gbif.org/v1/organization?country=DE&q=animals&limit=2&offset=0">
                  https://api.gbif.org/v1/organization?country=DE&q=animals&limit=2&offset=0
                </a>
              </Card>
            </div>
          </Popup>
        </div>
      </div>
    </div>
  );
}

export function Separator() {
  return <div className="g-border-l g-border-slate-200 g-h-6 g-mx-2"></div>;
}

export function Popup({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactElement;
  children: React.ReactElement;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={cn('g-w-96', className)}>{children}</PopoverContent>
    </Popover>
  );
}
