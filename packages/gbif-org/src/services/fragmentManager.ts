// When executing a GraphQL query, we need to add all fragments that are used in the queryx
// The fragment manager can recursively add the required fragments to queries before they are executed
// All fragments defined in the project needs to be registered with the fragment manager

type Fragment = {
  name: string;
  dependencies: string[];
  definition: string;
};

class FragmentManager {
  private fragments: Record<string, Fragment> = {};

  public register(fragmentDefinition: string) {
    const name = this.extractName(fragmentDefinition);

    const fragment: Fragment = {
      name,
      dependencies: this.extractUsedFragments(fragmentDefinition),
      definition: fragmentDefinition,
    };

    this.fragments[name] = fragment;
  }

  // Get all fragments that are required to execute a query
  // Some fragments might depend on other fragments, so we need to recursively
  // The function should return the original query with all fragments added to it
  public addFragmentsToQuery(graphQLQuery: string): string {
    // Find the fragments used in the original query
    const usedFragments = this.extractUsedFragments(graphQLQuery);

    // Recursively find all required fragments
    const allFragments = this.findAllFragments(usedFragments);

    // Combine the original query with all fragment definitions
    return (
      graphQLQuery + allFragments.map((fragName) => this.fragments[fragName].definition).join('')
    );
  }

  private findAllFragments(
    fragments: string[],
    checkedFragments: Set<string> = new Set()
  ): string[] {
    let allFragments: string[] = [];

    for (const fragment of fragments) {
      // If the fragment has already been checked, skip it
      if (checkedFragments.has(fragment)) {
        continue;
      }

      // Add the fragment to the list of checked fragments
      checkedFragments.add(fragment);

      // Add the fragment to the list
      allFragments.push(fragment);

      // Thow an error if the fragment does not exist
      if (!this.fragments[fragment]) {
        throw new Error(`Fragment ${fragment} has not been registered`);
      }

      // Recursively check for dependencies
      const dependencies = this.fragments[fragment].dependencies;
      allFragments = allFragments.concat(this.findAllFragments(dependencies, checkedFragments));
    }

    return [...new Set(allFragments)]; // Return unique values
  }

  private extractName(fragmentDefinition: string): string {
    return fragmentDefinition.split('fragment ')[1].split(' on')[0];
  }

  private extractUsedFragments(graphQLQuery: string): string[] {
    // Regular expression to match fragment spreads
    const fragmentSpreadRegex = /\.\.\.(\w+)/g;

    const matches = [];
    let match;

    // Extract all matches from the query
    while ((match = fragmentSpreadRegex.exec(graphQLQuery)) !== null) {
      matches.push(match[1]);
    }

    // Return unique fragment names
    return [...new Set(matches)];
  }
}

export const fragmentManager = new FragmentManager();
