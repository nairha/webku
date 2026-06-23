import type { IconName } from "@/resources/icons";
import type { zones } from "tzdata";

/**
 * IANA time zone string (e.g., 'Asia/Calcutta', 'Europe/Vienna').
 * See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
export type IANATimeZone = Extract<keyof typeof zones, string>; // Narrow to string keys for React usage

/**
 * Represents a person featured in the portfolio.
 */
export type Person = {
  /** First name of the person */
  firstName: string;
  /** Last name of the person */
  lastName: string;
  /** The name you want to display, allows variations like nicknames */
  name: string;
  /** Role or job title */
  role: string;
  /** Path to avatar image */
  avatar: string;
  /** Email address */
  email: string;
  /** IANA time zone location */
  location: IANATimeZone;
  /** Languages spoken */
  languages?: string[];
};

/**
 * Newsletter Section
 * @description The below information will be displayed on the Home page in Newsletter block
 */
export type Newsletter = {
  /** Whether to display the newsletter section */
  display: boolean;
  /** Title of the newsletter   */
  title: React.ReactNode;
  /** Description of the newsletter */
  description: React.ReactNode;
};

/**
 * Social link configuration.
 */
export type Social = Array<{
  /** Name of the social platform */
  name: string;
  /** Icon for the social platform
   * The icons are a part of "src/resources/icons.ts" file.
   * If you need a different icon, import it there and reference it everywhere else
   */
  icon: IconName;
  /**
   * The link to the social platform
   *
   * The link is not validated by code, make sure it's correct
   */
  link: string;
  /** Whether this social link is essential and should be displayed on the about page */
  essential?: boolean;
}>;

/**
 * Base interface for page configuration with common properties.
 */
export interface BasePageConfig {
  /** Path to the page
   *
   * The path should be relative to the public directory
   */
  path: `/${string}` | string;
  /** Label for navigation or display */
  label: string;
  /** Title of the page */
  title: string;
  /** Description for SEO and metadata */
  description: string;
  /** OG Image should be put inside `public/images` folder */
  image?: `/images/${string}` | string;
}

/**
 * Home page configuration.
 */
export interface Home extends BasePageConfig {
  /** The image to be displayed in metadata
   *
   * The image needs to be put inside `/public/images/` directory
   */
  image: `/images/${string}` | string;
  /** The headline of the home page */
  headline: React.ReactNode;
  /** Featured badge, which appears above the headline */
  featured: {
    display: boolean;
    title: React.ReactNode;
    href: string;
  };
  /** The sub text which appears below the headline */
  subline: React.ReactNode;
  /** Categorized badges for the home page */
  badges?: Array<{
    /** The label for the section (e.g., "Working at") */
    label: string;
    /** The list of badges in this section */
    items: Array<{
      /** The text to display in the badge */
      name: string;
      /** Optional icon name from the icon library */
      icon?: IconName;
    }>;
  }>;
  /** Content paragraphs for the home page */
  paragraphs?: React.ReactNode[];
  /** Tagline appearing below the name */
  tagline: React.ReactNode;
  /** Translatable labels for various sections */
  labels: {
    social: string;
    mail: string;
    projects: string;
    support: string;
    sponsorEcosystem: string;
    supportAuthor: string;
  };
}



/**
 * Blog page configuration.
 * @description Configuration for the Blog page, including metadata and navigation label.
 */
export interface Blog extends BasePageConfig { }

/**
 * Work/projects page configuration.
 * @description Configuration for the Work/Projects page, including metadata and navigation label.
 */
export interface Work extends BasePageConfig { }

/**
 * Gallery page configuration.
 * @description Configuration for the Gallery page, including metadata, navigation label, and image list.
 */
export interface Gallery extends BasePageConfig {
  /** List of images in the gallery */
  images: Array<{
    /** Image source path */
    src: string;
    /** Image alt text */
    alt: string;
    /** Image orientation (horizontal/vertical) */
    orientation: string;
  }>;
}

/**
 * Sponsor page configuration.
 */
export interface Sponsor extends BasePageConfig {
  title: string;
  description: string;
  hero: {
    headline: React.ReactNode;
    subline: React.ReactNode;
    supportMe: string;
  };
  tiers: Array<{
    name: string;
    description: string;
    tag: string;
    buttonText: string;
  }>;
  platforms?: Array<{
    name: string;
    icon: IconName;
    link: string;
    label: string;
  }>;
  quote: string;
}

/**
 * Speaking page configuration.
 * @description Configuration for the Speaking page, including metadata and navigation label.
 */
export interface Speaking extends BasePageConfig { }
/**
 * Friends page configuration.
 */
export interface Friends extends BasePageConfig {
  hero: {
    headline: React.ReactNode;
    subline: React.ReactNode;
  };
  sections: {
    online: {
      title: string;
      subtitle: string;
    };
    aktif: {
      title: string;
      subtitle: string;
    };
    pena: {
      title: string;
      subtitle: string;
    };
  };
  quote: string;
  friends: {
    online: Friend[];
    aktif: Friend[];
    pena: Friend[];
  };
}

/**
 * Represents a friend.
 */
export type Friend = {
  name: string;
  motto: string;
  avatar: string;
  website?: string;
  stack: ("Nuxt" | "Angular" | "Laravel" | "React" | "Vue" | "Next" | "Svelte")[];
};

/**
 * Experiments page configuration.
 */
export interface Experiments extends BasePageConfig {
  hero: {
    headline: React.ReactNode;
    subline: React.ReactNode;
  };
  github: {
    display: boolean;
    username: string;
    revalidate: number;
  };
  manual?: Array<{
    title: string;
    description: string;
    link: string;
    icon?: string;
    tech?: string[];
  }>;
}
/**
 * About page configuration.
 */
export interface About extends BasePageConfig {
  title: string;
  description: string;
  tableOfContent: boolean;
  avatar: {
    display: boolean;
    src: string;
  };
  calendar: {
    display: boolean;
    link: string;
  };
}
