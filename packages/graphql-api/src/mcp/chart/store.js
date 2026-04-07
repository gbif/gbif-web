import NodeCache from 'node-cache';
import hash from 'object-hash';
import Ajv from 'ajv';

// In-memory cache for chart configurations
const chartCache = new NodeCache({ stdTTL: 1200, checkperiod: 40 });

// Cache for the schema validator
let schemaValidator = null;

async function getSchemaValidator() {
  if (!schemaValidator) {
    const response = await fetch(
      'https://vega.github.io/schema/vega-lite/v5.json',
    );
    const schema = await response.json();
    const ajv = new Ajv();
    schemaValidator = ajv.compile(schema);
  }
  return schemaValidator;
}

export function addChart(queryId, config) {
  const existing = chartCache.get(queryId);
  const obj = existing ?? { charts: [] };
  obj.charts = obj.charts || [];
  obj.charts.push(config);
  // const id = hash(config);
  chartCache.set(queryId, obj);
  return queryId;
}

export function createChartConfig(queryId, config) {
  chartCache.set(queryId, config);
}

export function getChartConfig(key) {
  const specs = chartCache.get(key);
  return specs;
}

export function getAllKeys() {
  return chartCache.keys();
}

export async function validateChartConfig(vegaLiteSpec) {
  try {
    const validate = await getSchemaValidator();
    const valid = validate(vegaLiteSpec);

    if (!valid) {
      console.error('Invalid Vega-Lite spec:', validate.errors);
      return {
        valid: false,
        errors: validate.errors,
      };
    }

    console.log('Valid Vega-Lite spec');
    return { valid: true };
  } catch (error) {
    console.error('Validation error:', error.message);
    return {
      valid: false,
      error: error.message,
    };
  }
}
