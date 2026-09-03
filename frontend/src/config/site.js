// frontend/src/config/site.js
export const siteConfig = {
    siteName: 'RemoteHub',
    description: 'Work From Home Jobs & Career News — Find your next remote opportunity.',
    domain: 'https://remotehub.app',
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    logo: '/logo.svg',
    supportEmail: 'support@remotehub.app',
    social: {
        twitter: '@remotehub',
        github: 'remotehub',
        linkedin: 'remotehub',
    },
    defaultImage: '/og-image.jpg',
};