import { gql } from 'apollo-server';

const typeDef = gql`
  type LocalContext {
    unique_id: String
    notice_page: String
    name: String
    notice_type: String
    language_tag: String
    language: String
    default_text: String
    img_url: String
    svg_url: String
    translations: [String]
    date_added: DateTime
    created: DateTime
    updated: DateTime
  }
`;

export default typeDef;
