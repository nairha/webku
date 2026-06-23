// constants/appData.js
export const SITE_DATA = {
  profile: {
    Fist_name: "Davin",
    Last_name: "Gahisan Mustafid",
    Image: "img/Davin_Gahisan_Mustafid.png",
    Fist_role: "Frontend",
    Last_role: "Engineer",
    email: "davin.gm.etc@gmail.com",
    phone: "+62882102289177",
    whatsapp: "https://wa.me/62882102289177",
    location: "Jakarta, Indonesia",
    City: "Bandung",
    Zone: "West Java",
    Country: "Indonesia",
    Focus: "Nuxt Ecosystem",

    // Conting 
    Count_Project: 5,
    Experience: 2,
    Count_Tech: 21,
    Coffee: "99%",
    HappyClient: 0
  },

  socials: [
    { name: 'Linkedin', url: 'https://www.linkedin.com/in/davin-gahisan-016b77390' },
    { name: 'Instagram', url: 'https://www.instagram.com/xiao4_72' },
    { name: 'Github', url: 'https://github.com/DavinGM' },
    { name: 'whatsapp', url: 'https://wa.me/62882102289177' },
  ],

  Stats: {
    OpenToWork: false,
    AvalibelForProject: false
  },

  listen: {
    sponsor: [
      'NLFTs',
      'Asia Code 2022',
      'Ryn Creative',
      'Project FTs 2024',
      'GANTARA '
    ],

    service: [
      'Web Development',
      'UI/UX Design',
      'Brand Identity',
      'Consulting Design',
    ]
  },


  // Detail Project in File utils/appProject
  projects_featured: [
    {
      title: 'Pintar Yuk',
      year: '2025',
      category: 'E-commerce Platform for Artisans',
      tech: ['Laravel 12', 'GSAP', 'Tailwind'],
      image: '/img/Projects/PintarYuk.png'
    },
    {
      title: 'NLFTs',
      year: '2024',
      category: 'High-Performance NLFTs Marketplace and Liblary',
      tech: ['Nuxt 4', 'Tailwind', 'MongoDB'],
      image: '/img/Projects/Nlfts.png'
    }
    // {
    //   title: 'Portofolio',
    //   year: '2026',
    //   category: 'Portfolio Web Experience',
    //   tech: ['Nuxt 4', 'Tailwind', 'GSAP'],
    //   image: 'img/Projects/Portofolio.png'
    // }

  ]
}

//  For Landing Design DNA
export const SITE_ITEMS = [
  {
    id: 1,
    code: '01',
    title: 'Start With Intent',
    desc: 'Every design starts with a purpose. Without a clear intent, visuals become mere noise that disrupts the user experience..',
    image: 'img/intent.png',
    tags: ['Strategy', 'Purpose', 'Direction']
  },
  {
    id: 2,
    code: '02',
    title: 'State-of-the-art technology',
    desc: 'Technology becomes a symbol of creativity and technical skill for application stability.',
    image: 'img/tech.png',
    tags: ['Next', 'Nuxt', 'Tailwind']
  },
  {
    id: 3,
    code: '03',
    title: 'Atomic Design as a System',
    desc: 'Components, grid, and visual rules work as a consistent and scalable system for the long term.',
    image: 'img/atom.png',
    tags: ['Systems', 'Scale', 'Consistency']
  },
  {
    id: 4,
    code: '04',
    title: 'Refine Relentlessly',
    desc: 'Small details determine final quality. Refinement is not the final stage in the process, but a persistent mindset.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
    tags: ['Craft', 'Detail', 'Excellence']
  }
]


//for Landing Experience
export const SITE_expertiseData = [
  {
    title: 'Modern Architecture',
    stack: 'Nuxt 3 / TypeScript',
    desc: 'Implementation of a robust server-side architecture to ensure unmatched access speed and application scalability.',
    iconPath: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5'
  },
  {
    title: 'Kinetic Experience',
    stack: 'GSAP / WebGL',
    desc: 'Conveying emotion through movement. Focus on micro-interactions and subtle transitions that increase user satisfaction.',
    iconPath: 'M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672z'
  },
  {
    title: 'Visual Engineering',
    stack: 'Tailwind / UI Design',
    desc: 'Precise interface development down to the pixel level, ensuring design consistency across devices and resolutions.',
    iconPath: 'M9.53 16.122a3 3 0 00-3.032 4.674m3.032-4.674a3 3 0 013.032-4.674m-3.032 4.674l3.032-4.674m0 0a3 3 0 003.032 4.674m-3.032-4.674l3.032 4.674'
  }
]





// My Journy

export const SITE_journy = [
  {
    year: '2024',
    type: 'education',
    title: 'Begginer FullStack Developer',
    subtitle: 'Laravel and PHP Ecosystem.',
    description: 'Leading traditional web architecture with Laravel 12 and Bootstrap. Building a scalable CMS.',
    tags: ['Boostrap', 'Laravel 12', 'PHP', 'MySQL']
  },
  {
    year: '2024',
    type: 'Company',
    title: 'Contributor with NLFTs',
    subtitle: 'Vue Pixle Liblary',
    description: 'Contribute to ecosystem projects within the NFTs Company. Share knowledge through technical writing and help the developer community grow.',
    tags: ['Open Source', 'Community', 'Mentoring', 'NLFTs']
  },
  {
    year: '2025',
    type: 'Engginer',
    title: 'Frontend Engineer',
    subtitle: 'Nuxt Entry Level',
    description: 'Developing projects using modern JavaScript frameworks such as Nuxt and Next to create high-performance (Progressive web framework) and accessible sites..',
    tags: ['Tailwind CSS', 'Nuxt', 'Nuxt Module', 'Nuxters']
  },
  {
    year: '2026',
    type: 'Nuxt Education',
    title: 'start joining the Nuxt.js developer ecosystem',
    subtitle: 'Self-Taught & Online Courses',
    description: 'Start learning modern web development through online courses and building personal projects. Fall in love with Nuxt.js and modern web technologies.',
    tags: ['Vue.js', 'Nuxt.js', 'Tailwind CSS', 'GSAP']
  }
]

















