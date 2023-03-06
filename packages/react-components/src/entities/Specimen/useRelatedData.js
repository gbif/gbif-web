import { useState, useEffect, useContext } from 'react';
import { ApiContext, ApiClient } from '../../dataManagement/api';
import { useQuery, } from '../../dataManagement/api';
import get from 'lodash/get';
import _ from 'lodash';

// requires a graphql endpoint running on the model
const customClient = new ApiClient({
  gql: {
    endpoint: 'http://labs.gbif.org:7002/graphql',
    // endpoint: 'http://localhost:7002/graphql',
  }
});

function useRelatedData({ id, type }) {
  const client = useContext(ApiContext);
  const [content, setContent] = useState();
  const { data, error, loading, load } = useQuery(RELATED, { client: customClient, lazyLoad: true });

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const query = {
        variables: {
          key: id,
          type
        }
      };
      load(query);
    }
  }, [id, type]);

  useEffect(() => {
    if (data && !loading && !error) {
      // remap data to more useful structure
      const restructuredData = restructure(data);
      setContent(restructuredData);
    }
  }, [data, loading, error]);

  return [content, error, loading];
}

export default useRelatedData;

const RELATED = `
query($key: String!, $type: CommonTargets) {
  allAssertions(condition: {assertionTargetId: $key, assertionTargetType: $type}) {
    nodes {
      assertionId
      assertionType
      assertionUnit
      assertionValue
      assertionValueNumeric
      assertionMadeDate
      assertionProtocol
      assertionRemarks
      assertionByAgentName
    }
  }
  allIdentifiers(condition: {identifierTargetId: $key}) {
    nodes {
      identifierType
      identifierValue
      nodeId
    }
  }
  allCitations(condition: {citationTargetId: $key}) {
    nodes {
      citationTargetType
      citationType
      referenceByCitationReferenceId {
        bibliographicCitation
        referenceIri
        referenceYear
        referenceType
      }
    }
  }
  allAgentRoles(condition: {agentRoleTargetId: $key}) {
    nodes {
      agentRoleAgentId
      agentRoleRole
      agentRoleBegan
      agentRoleEnded
      agentRoleOrder
      agentByAgentRoleAgentId {
        preferredAgentName
        agentType
        agentId
      }
    }
  }
}
`;


function restructure(data) {
  const content = {};
  console.log(data);

  content.assertions = get(data, 'allAssertions.nodes', []);
  content.identifiers = get(data, 'allIdentifiers.nodes', []);
  content.citations = get(data, 'allCitations.nodes', []).map(x => x.referenceByCitationReferenceId);
  content.roles = get(data, 'allAgentRoles.nodes', []);

  console.log(content);
  return content;
}
