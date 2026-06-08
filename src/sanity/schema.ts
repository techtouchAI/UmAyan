import { type SchemaTypeDefinition } from 'sanity';

import { siteSettingsType } from './schemas/settings';
import { categoryType } from './schemas/category';
import { postType } from './schemas/post';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsType, categoryType, postType],
};
