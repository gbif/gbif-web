import { gql } from 'apollo-server';

const typeDef = gql`
  type LocalContext {
    notice: [LocalContextNotice]
  }

  type LocalContextNotice {
    unique_id: String
    notice_page: String
    name(lang: String): String
    notice_type: String
    language_tag: String
    language: String
    default_text(lang: String): String
    img_url: String
    svg_url: String
    translations: [String]
    date_added: DateTime
    created: DateTime
    updated: DateTime
  }
`;

export default typeDef;
