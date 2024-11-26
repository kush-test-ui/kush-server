import type { Schema, Attribute } from '@strapi/strapi';

export interface ComplexCategoryGroup extends Schema.Component {
  collectionName: 'components_complex_category_groups';
  info: {
    displayName: 'Category';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    categories: Attribute.Relation<
      'complex.category-group',
      'oneToMany',
      'api::category.category'
    >;
  };
}

export interface ComplexCollectionGroup extends Schema.Component {
  collectionName: 'components_complex_collection_groups';
  info: {
    displayName: 'Collection';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    collections: Attribute.Relation<
      'complex.collection-group',
      'oneToMany',
      'api::collection.collection'
    >;
  };
}

export interface ComplexDeliveryRule extends Schema.Component {
  collectionName: 'components_complex_delivery_rules';
  info: {
    displayName: 'Delivery Rule';
    icon: 'archive';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    icon: Attribute.Enumeration<['clock', 'protect', 'delivery']>;
  };
}

export interface ComplexFilterForm extends Schema.Component {
  collectionName: 'components_complex_filter_forms';
  info: {
    displayName: 'Filter Form';
    icon: 'cog';
  };
  attributes: {
    categoryFields: Attribute.Component<'elements.input', true>;
    materiaFields: Attribute.Component<'elements.input', true>;
    sizeFields: Attribute.Component<'elements.input', true>;
    sortFields: Attribute.Component<'elements.input', true>;
    category: Attribute.String;
    material: Attribute.String;
    size: Attribute.String;
    price: Attribute.String;
    submitBtn: Attribute.Component<'elements.button'>;
    resetBtn: Attribute.Component<'elements.button'>;
  };
}

export interface ComplexHeroSection extends Schema.Component {
  collectionName: 'components_layouts_hero_sections';
  info: {
    displayName: 'Hero';
    icon: 'stack';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    image: Attribute.Media;
    link: Attribute.Component<'elements.link'>;
    sub_image: Attribute.Media;
  };
}

export interface ComplexProducts extends Schema.Component {
  collectionName: 'components_complex_products';
  info: {
    displayName: 'Products';
    icon: 'dashboard';
    description: '';
  };
  attributes: {
    title: Attribute.String;
  };
}

export interface ComplexProfileForm extends Schema.Component {
  collectionName: 'components_complex_profile_forms';
  info: {
    displayName: 'Profile Form';
    icon: 'shield';
    description: '';
  };
  attributes: {
    general: Attribute.Component<'elements.input', true>;
    additional: Attribute.Component<'elements.input', true>;
    contacts: Attribute.Component<'elements.input', true>;
    generalTitle: Attribute.String;
    additionalTitle: Attribute.String;
    contactsTitle: Attribute.String;
    actions: Attribute.Component<'elements.button', true>;
  };
}

export interface ComplexProviders extends Schema.Component {
  collectionName: 'components_complex_providers';
  info: {
    displayName: 'Providers';
    icon: 'shield';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    key: Attribute.Enumeration<['google', 'facebook', 'instagram']> &
      Attribute.DefaultTo<'google'>;
  };
}

export interface ComplexShoppingCart extends Schema.Component {
  collectionName: 'components_complex_shopping_carts';
  info: {
    displayName: 'Shopping Cart';
    icon: 'shoppingCart';
  };
  attributes: {
    title: Attribute.String;
    totalPrice: Attribute.String;
    checkout: Attribute.String;
    getBack: Attribute.String;
    emptyList: Attribute.String;
  };
}

export interface ComplexSpotlight extends Schema.Component {
  collectionName: 'components_complex_spotlights';
  info: {
    displayName: 'Spotlight';
    icon: 'archive';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    products: Attribute.Relation<
      'complex.spotlight',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface ElementsButton extends Schema.Component {
  collectionName: 'components_elements_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    type: Attribute.String;
    text: Attribute.String;
    loadingText: Attribute.String;
  };
}

export interface ElementsInput extends Schema.Component {
  collectionName: 'components_elements_inputs';
  info: {
    displayName: 'Input';
    icon: 'pencil';
    description: '';
  };
  attributes: {
    label: Attribute.String;
    placeholder: Attribute.String;
    name: Attribute.String;
    type: Attribute.String;
  };
}

export interface ElementsLink extends Schema.Component {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
    icon: 'link';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    text: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ElementsSocialLink extends Schema.Component {
  collectionName: 'components_elements_social_links';
  info: {
    displayName: 'socialLink';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    format: Attribute.Enumeration<['facebook', 'instagram', 'tiktok']>;
    url: Attribute.String;
    isExternal: Attribute.Boolean;
  };
}

export interface LayoutsFooter extends Schema.Component {
  collectionName: 'components_layouts_footers';
  info: {
    displayName: 'Footer';
    description: '';
  };
  attributes: {
    formField: Attribute.Component<'elements.input'>;
    termsLink: Attribute.Component<'elements.link', true>;
    linksGroupTitle: Attribute.String;
    links: Attribute.Component<'elements.link', true>;
    contactGroupTitle: Attribute.String;
    address: Attribute.String;
    socialGroupTitle: Attribute.String;
    socialLinks: Attribute.Component<'elements.social-link', true>;
    primaryPhone: Attribute.String;
    secondaryPhone: Attribute.String;
    tertiaryPhone: Attribute.String;
  };
}

export interface LayoutsHeader extends Schema.Component {
  collectionName: 'components_layouts_headers';
  info: {
    displayName: 'Header';
    description: '';
  };
  attributes: {
    logoText: Attribute.Component<'elements.link'>;
    cta: Attribute.Component<'elements.link'>;
    sessionLinks: Attribute.Component<'elements.link', true> &
      Attribute.Required;
    pages: Attribute.Component<'elements.link', true>;
    collections: Attribute.Relation<
      'layouts.header',
      'oneToMany',
      'api::collection.collection'
    >;
    categories: Attribute.Relation<
      'layouts.header',
      'oneToMany',
      'api::category.category'
    >;
    categoryTitle: Attribute.String;
    collectionTitle: Attribute.String;
    pagesTitle: Attribute.String;
    searchTitle: Attribute.String;
    signOutTitle: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Sign out'>;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'complex.category-group': ComplexCategoryGroup;
      'complex.collection-group': ComplexCollectionGroup;
      'complex.delivery-rule': ComplexDeliveryRule;
      'complex.filter-form': ComplexFilterForm;
      'complex.hero-section': ComplexHeroSection;
      'complex.products': ComplexProducts;
      'complex.profile-form': ComplexProfileForm;
      'complex.providers': ComplexProviders;
      'complex.shopping-cart': ComplexShoppingCart;
      'complex.spotlight': ComplexSpotlight;
      'elements.button': ElementsButton;
      'elements.input': ElementsInput;
      'elements.link': ElementsLink;
      'elements.social-link': ElementsSocialLink;
      'layouts.footer': LayoutsFooter;
      'layouts.header': LayoutsHeader;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
