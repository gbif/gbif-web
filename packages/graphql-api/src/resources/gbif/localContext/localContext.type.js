import { gql } from 'apollo-server';

const typeDef = gql`
  type LocalContext {
    project_page: String
    title: String
    description: String
    notice: [LocalContextNotice]
    bc_labels: [LocalContextLabel]
    tk_labels: [LocalContextLabel]
    labels: [LocalContextLabel]
    notes: [LocalContextNote]
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
    translations: [LocalContextTranslation]
    date_added: DateTime
    created: DateTime
    updated: DateTime
  }

  type LocalContextLabel {
    unique_id: String
    label_page: String
    name(lang: String): String
    label_type: String
    img_url: String
    svg_url: String
    label_text(lang: String): String
    translations: [LocalContextTranslation]
  }

  type LocalContextNote {
    unique_id: String
    pageUrl: String
    name(lang: String): String
    img_url: String
    svg_url: String
    description(lang: String): String
  }

  type LocalContextTranslation {
    translated_name: String
    language_tag: String
    language: String
    translated_text: String
  }
`;

export default typeDef;
