import type { Schema, Attribute } from '@strapi/strapi';

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
    actions: Attribute.Component<'elements.button', true>;
    avatar: Attribute.Media;
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

export interface LayoutsFooter extends Schema.Component {
  collectionName: 'components_layouts_footers';
  info: {
    displayName: 'footer';
  };
  attributes: {
    logoText: Attribute.Component<'elements.link'>;
    text: Attribute.Text;
    socialLink: Attribute.Component<'elements.link', true>;
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
    ctaButton: Attribute.Component<'elements.link'>;
    sessionLinks: Attribute.Component<'elements.link', true> &
      Attribute.Required;
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
      'complex.hero-section': ComplexHeroSection;
      'complex.profile-form': ComplexProfileForm;
      'complex.providers': ComplexProviders;
      'complex.shopping-cart': ComplexShoppingCart;
      'elements.button': ElementsButton;
      'elements.input': ElementsInput;
      'elements.link': ElementsLink;
      'layouts.footer': LayoutsFooter;
      'layouts.header': LayoutsHeader;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
