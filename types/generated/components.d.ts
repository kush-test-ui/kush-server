import type { Attribute, Schema } from '@strapi/strapi';

export interface ComplexCategoryGroup extends Schema.Component {
  collectionName: 'components_complex_category_groups';
  info: {
    description: '';
    displayName: 'Category';
    icon: 'bulletList';
  };
  attributes: {
    categories: Attribute.Relation<
      'complex.category-group',
      'oneToMany',
      'api::category.category'
    >;
    title: Attribute.String;
  };
}

export interface ComplexCollectionGroup extends Schema.Component {
  collectionName: 'components_complex_collection_groups';
  info: {
    description: '';
    displayName: 'Collection';
    icon: 'bulletList';
  };
  attributes: {
    collections: Attribute.Relation<
      'complex.collection-group',
      'oneToMany',
      'api::collection.collection'
    >;
    title: Attribute.String;
  };
}

export interface ComplexDeliveryRule extends Schema.Component {
  collectionName: 'components_complex_delivery_rules';
  info: {
    description: '';
    displayName: 'Delivery Rule';
    icon: 'archive';
  };
  attributes: {
    description: Attribute.Text;
    icon: Attribute.Enumeration<['clock', 'protect', 'delivery']>;
    title: Attribute.String;
  };
}

export interface ComplexFilterForm extends Schema.Component {
  collectionName: 'components_complex_filter_forms';
  info: {
    displayName: 'Filter Form';
    icon: 'cog';
  };
  attributes: {
    category: Attribute.String;
    categoryFields: Attribute.Component<'elements.input', true>;
    materiaFields: Attribute.Component<'elements.input', true>;
    material: Attribute.String;
    price: Attribute.String;
    resetBtn: Attribute.Component<'elements.button'>;
    size: Attribute.String;
    sizeFields: Attribute.Component<'elements.input', true>;
    sortFields: Attribute.Component<'elements.input', true>;
    submitBtn: Attribute.Component<'elements.button'>;
  };
}

export interface ComplexHeroSection extends Schema.Component {
  collectionName: 'components_layouts_hero_sections';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'stack';
  };
  attributes: {
    description: Attribute.Text;
    image: Attribute.Media<'images'>;
    link: Attribute.Component<'elements.link'>;
    sub_image: Attribute.Media<'images'>;
    title: Attribute.String;
  };
}

export interface ComplexProducts extends Schema.Component {
  collectionName: 'components_complex_products';
  info: {
    description: '';
    displayName: 'Products';
    icon: 'dashboard';
  };
  attributes: {
    title: Attribute.String;
  };
}

export interface ComplexProfileForm extends Schema.Component {
  collectionName: 'components_complex_profile_forms';
  info: {
    description: '';
    displayName: 'Profile Form';
    icon: 'shield';
  };
  attributes: {
    actions: Attribute.Component<'elements.button', true>;
    additional: Attribute.Component<'elements.input', true>;
    additionalTitle: Attribute.String;
    contacts: Attribute.Component<'elements.input', true>;
    contactsTitle: Attribute.String;
    general: Attribute.Component<'elements.input', true>;
    generalTitle: Attribute.String;
  };
}

export interface ComplexProviders extends Schema.Component {
  collectionName: 'components_complex_providers';
  info: {
    description: '';
    displayName: 'Providers';
    icon: 'shield';
  };
  attributes: {
    key: Attribute.Enumeration<['google', 'facebook', 'instagram']> &
      Attribute.DefaultTo<'google'>;
    text: Attribute.String;
  };
}

export interface ComplexShoppingCart extends Schema.Component {
  collectionName: 'components_complex_shopping_carts';
  info: {
    displayName: 'Shopping Cart';
    icon: 'shoppingCart';
  };
  attributes: {
    checkout: Attribute.String;
    emptyList: Attribute.String;
    getBack: Attribute.String;
    title: Attribute.String;
    totalPrice: Attribute.String;
  };
}

export interface ComplexSpotlight extends Schema.Component {
  collectionName: 'components_complex_spotlights';
  info: {
    description: '';
    displayName: 'Spotlight';
    icon: 'archive';
  };
  attributes: {
    products: Attribute.Relation<
      'complex.spotlight',
      'oneToMany',
      'api::product.product'
    >;
    title: Attribute.String;
  };
}

export interface ElementsButton extends Schema.Component {
  collectionName: 'components_elements_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    loadingText: Attribute.String;
    text: Attribute.String;
    type: Attribute.String;
  };
}

export interface ElementsInput extends Schema.Component {
  collectionName: 'components_elements_inputs';
  info: {
    description: '';
    displayName: 'Input';
    icon: 'pencil';
  };
  attributes: {
    label: Attribute.String;
    name: Attribute.String;
    placeholder: Attribute.String;
    type: Attribute.String;
  };
}

export interface ElementsLink extends Schema.Component {
  collectionName: 'components_elements_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String;
    url: Attribute.String & Attribute.Required;
  };
}

export interface ElementsSocialLink extends Schema.Component {
  collectionName: 'components_elements_social_links';
  info: {
    description: '';
    displayName: 'socialLink';
    icon: 'bulletList';
  };
  attributes: {
    format: Attribute.Enumeration<['facebook', 'instagram', 'tiktok']>;
    isExternal: Attribute.Boolean;
    url: Attribute.String;
  };
}

export interface LayoutsFooter extends Schema.Component {
  collectionName: 'components_layouts_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    address: Attribute.String;
    contactGroupTitle: Attribute.String;
    formField: Attribute.Component<'elements.input'>;
    links: Attribute.Component<'elements.link', true>;
    linksGroupTitle: Attribute.String;
    primaryPhone: Attribute.String;
    secondaryPhone: Attribute.String;
    socialGroupTitle: Attribute.String;
    socialLinks: Attribute.Component<'elements.social-link', true>;
    termsLink: Attribute.Component<'elements.link', true>;
    tertiaryPhone: Attribute.String;
  };
}

export interface LayoutsHeader extends Schema.Component {
  collectionName: 'components_layouts_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    categories: Attribute.Relation<
      'layouts.header',
      'oneToMany',
      'api::category.category'
    >;
    categoryTitle: Attribute.String;
    collections: Attribute.Relation<
      'layouts.header',
      'oneToMany',
      'api::collection.collection'
    >;
    collectionTitle: Attribute.String;
    cta: Attribute.Component<'elements.link'>;
    logoText: Attribute.Component<'elements.link'>;
    pages: Attribute.Component<'elements.link', true>;
    pagesTitle: Attribute.String;
    searchTitle: Attribute.String;
    sessionLinks: Attribute.Component<'elements.link', true> &
      Attribute.Required;
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
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Attribute.String;
    keywords: Attribute.Text;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Attribute.String;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Attribute.String;
    structuredData: Attribute.JSON;
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
