import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://email-nexus-apex-horizon.vercel.app'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/private/'],
            },
            {
                // Allow Googlebot full access for rich results
                userAgent: 'Googlebot',
                allow: '/',
            },
            {
                // Allow Google image bot to index branding and hero assets
                userAgent: 'Googlebot-Image',
                allow: ['/logo.png', '/image.png', '/Logo2.svg'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}