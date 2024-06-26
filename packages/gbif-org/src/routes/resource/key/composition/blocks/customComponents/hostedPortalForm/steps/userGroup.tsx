import { TextField } from '../hostedPortalForm';

export function UserGroup() {
  return (
    <TextField
      name="userGroup"
      textarea
      descriptionPosition="above"
      description="Have you identified a group of users for the portal? How would you describe their needs? Please also explain how you have identified the user group and their needs. If the portal is replacing an existing website, please provide a link if available and explain why you think a hosted portal would be a better solution."
    />
  );
}
