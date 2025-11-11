# AltmetricDonut

Call the Altmetrics API and show the donut with a link to the Altmetrics details page.
We should investigate API keys, pricing and usage quotas before going live with this. Using it without an API key is legal, but is rate limited per IP. Which might be fine as we distribute it to the browser. Another approach could be to use GraphQL, that would probably perform better, but would be more likely to be blocked.