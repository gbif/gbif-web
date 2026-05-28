const stateSeverityMap = {
  none: 0,
  maintenance: 10,
  minor: 20,
  major: 30,
  critical: 40,
};

const severityColorMap = {
  none: '#00ff00',
  maintenance: '#006eff',
  minor: '#ffa500',
  major: '#ff4500',
  critical: '#fa4c0c',
};

export default {
  Query: {
    statusPage: (parent, { key }, { dataSources }) =>
      dataSources.statusPageAPI.getStatus({ key }),
  },
  StatusPage: {
    notificationIcon: ({ status, incidents, scheduled_maintenances }) => {
      let states = [];
      if (incidents && incidents.length > 0) {
        states = states.concat(incidents.map((incident) => incident.impact));
      }
      if (scheduled_maintenances && scheduled_maintenances.length > 0) {
        states = states.concat(
          scheduled_maintenances.map((maintenance) => maintenance.impact),
        );
      }
      states.push(status.indicator);

      const highestSeverityState = states.reduce((prev, curr) => {
        return stateSeverityMap[prev] > stateSeverityMap[curr] ? prev : curr;
      }, 'none');

      return {
        color: severityColorMap[highestSeverityState],
        showNotification: highestSeverityState !== 'none',
        status: highestSeverityState,
      };
    },
  },
};
