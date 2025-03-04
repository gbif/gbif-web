import { Table } from '@/components/dashboard/shared';
import { HyperText } from '@/components/hyperText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { VerbatimTaxonQuery, VerbatimTaxonQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTaxonKeyLoaderData } from '.';
const VerbatimTaxon = () => {
  const { data } = useTaxonKeyLoaderData();
  const {
    data: verbatimTaxon,
    load: verbatimTaxonLoad,
    loading: verbatimTaxonLoading,
  } = useQuery<VerbatimTaxonQuery, VerbatimTaxonQueryVariables>(VERBATIM_TAXON, {
    lazyLoad: true,
    throwAllErrors: true,
  });
  useEffect(() => {
    const id = data.taxon?.key;
    if (typeof id !== 'undefined') {
      verbatimTaxonLoad({
        variables: {
          key: id.toString(),
        },
      });
    }
  }, [data.taxon?.key, verbatimTaxonLoad]);

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {verbatimTaxon?.taxon?.verbatim && (
          <Card className="g-mb-4">
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="taxon.verbatim.coreRecord" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table removeBorder={false}>
                <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
                  <tr>
                    <th className="g-text-start">
                      <FormattedMessage id={`taxon.verbatim.term`} />
                    </th>
                    <th className="g-text-start">
                      <FormattedMessage id={`taxon.verbatim.value`} />
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
                  {(Object.keys(verbatimTaxon?.taxon?.verbatim) || [])
                    .filter((k) => k?.startsWith('http://'))
                    .map((e, i) => {
                      return (
                        <tr key={i}>
                          <td className="g-text-sm g-text-slate-500">{e}</td>
                          <td className="g-text-sm g-text-slate-500">
                            <HyperText text={verbatimTaxon?.taxon?.verbatim[e]} />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        )}
        {verbatimTaxon?.taxon?.verbatim?.extensions &&
          Object.keys(verbatimTaxon?.taxon?.verbatim?.extensions).length > 0 &&
          Object.keys(verbatimTaxon?.taxon?.verbatim?.extensions).map((e, i) => {
            return (
              <Card key={i} className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    {/* <FormattedMessage id="taxon.verbatim.coreRecord" /> */}
                    {e}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table removeBorder={false}>
                    <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
                      <tr>
                        <th className="g-text-start">
                          <FormattedMessage id={`taxon.verbatim.term`} />
                        </th>
                        <th className="g-text-start">
                          <FormattedMessage id={`taxon.verbatim.value`} />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
                      {verbatimTaxon?.taxon?.verbatim?.extensions[e].map((row, i) => {
                        return Object.keys(row).map((key) => (
                          <tr key={i}>
                            <td className="g-text-sm g-text-slate-500">{key}</td>
                            <td className="g-text-sm g-text-slate-500">
                              <HyperText text={row[key]} />
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
      </ArticleTextContainer>
    </ArticleContainer>
  );
};

const VERBATIM_TAXON = /* GraphQL */ `
  query VerbatimTaxon($key: ID!) {
    taxon(key: $key) {
      verbatim
    }
  }
`;

export default VerbatimTaxon;
