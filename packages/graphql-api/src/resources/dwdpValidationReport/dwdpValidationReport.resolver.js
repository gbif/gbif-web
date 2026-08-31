// Jackson serialises java.time.LocalDateTime as
// [year, month, day, hour, minute, second, nanoOfSecond] (month is already 1-indexed).
// LocalDateTime carries no time zone, so this is formatted as a zone-less ISO-8601
// string (e.g. "2026-08-31T11:59:47.890170096") rather than assuming UTC.
function formatLocalDateTime(value) {
  if (!Array.isArray(value)) return value ?? null;
  const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = value;
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const fraction = nano ? `.${String(nano).padStart(9, '0')}` : '';
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}${fraction}`;
}

export default {
  Query: {
    dwdpValidationReport: async (
      parent,
      { datasetKey, attempt },
      { dataSources },
    ) => {
      const report = await dataSources.dwdpValidationReportAPI.getValidationReport({
        datasetKey,
        attempt,
      });
      if (!report) return null;
      return {
        ...report,
        datasetKey,
        attempt,
        metadata: report.metadata && {
          ...report.metadata,
          started: formatLocalDateTime(report.metadata.started),
          finished: formatLocalDateTime(report.metadata.finished),
        },
      };
    },
  },
};
