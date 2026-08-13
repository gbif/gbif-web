// Cap the batch so a single request can't fan out into an unbounded number of upstream calls.
const MAX_BATCH = 100;

export default {
  Query: {
    // Validate a batch of raw nucleotide sequences. Results preserve input order; a failed
    // validation yields null for that slot rather than failing the whole batch.
    sequenceValidation: async (parent, { sequences }, { dataSources }) => {
      if (!Array.isArray(sequences) || sequences.length === 0) return [];
      if (sequences.length > MAX_BATCH) {
        throw new Error(
          `sequenceValidation accepts at most ${MAX_BATCH} sequences per request (got ${sequences.length}).`,
        );
      }
      return Promise.all(
        sequences.map((sequence) =>
          dataSources.sequenceValidationAPI
            .validateSequence(sequence)
            .catch(() => null),
        ),
      );
    },
  },
};
