import { ClientSideOnly } from "@/components/clientSideOnly";
import * as charts from "@/components/dashboard";
import { ArticleContainer } from "@/routes/resource/key/components/articleContainer";

export default function About() {
  const predicate = {
    "type": "equals",
    key: 'collectionKey',
    value: 'e9d2c520-d9fc-4331-9ed8-73bea2b22af0'
  };
  return <ArticleContainer className="bg-slate-100 pt-0">
    <ClientSideOnly>
      {/* <charts.Taxa /> */}
      <charts.Iucn predicate={predicate}/>
      {/* <charts.IucnCounts /> */}
      {/* <charts.GadmGid predicate={predicate} />
      <charts.Country predicate={predicate}/>
      <charts.OccurrenceIssue predicate={predicate}/>
      <charts.EventDate predicate={predicate}/> */}
      {/* <charts.OccurrenceIssue predicate={predicate} /> */}
      {/* <charts.Months predicate={predicate}/>
      <charts.Continent predicate={predicate}/>
      <charts.OccurrenceSummary predicate={predicate}/>
      <charts.DataQuality predicate={predicate} />
      <charts.Licenses predicate={predicate}/>
      <charts.MediaType predicate={predicate}/>
      <charts.LiteratureTopics /> */}
    </ClientSideOnly>
  </ArticleContainer>;
}
