import type { Schema, Attribute } from '@strapi/strapi';

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
    text: Attribute.Text;
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

export interface LayoutsHeroSection extends Schema.Component {
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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'complex.providers': ComplexProviders;
      'elements.button': ElementsButton;
      'elements.input': ElementsInput;
      'elements.link': ElementsLink;
      'layouts.footer': LayoutsFooter;
      'layouts.header': LayoutsHeader;
      'layouts.hero-section': LayoutsHeroSection;
    }
  }
}
