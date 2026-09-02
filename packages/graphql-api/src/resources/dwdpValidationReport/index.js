import resolver from './dwdpValidationReport.resolver';
import dwdpValidationReportAPI from './dwdpValidationReport.source';
import typeDef from './dwdpValidationReport.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    dwdpValidationReportAPI,
  },
};
