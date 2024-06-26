import { TextField } from '../hostedPortalForm';

export function Languages() {
  return (
    <TextField
      name="languages"
      textarea
      descriptionPosition="above"
      description="What languages would you like your hosted portal to be available in? Please note that you will need to translate your own content and menu, and may need to contribute translations for common elements such as data search components for languages other than English if they are not already available."
    />
  );
}
