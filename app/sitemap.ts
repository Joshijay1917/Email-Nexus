import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://email-nexus-apex-horizon.vercel.app'

  return [
    // Homepage — main landing page
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        `${baseUrl}/logo.png`,
        `${baseUrl}/image.png`,
      ],
    },
    // Anchor sections — helps crawlers understand page structure
    // Features section
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Simulator section
    {
      url: `${baseUrl}/#simulator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // FAQ section
    {
      url: `${baseUrl}/#faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Waitlist / Hero section
    {
      url: `${baseUrl}/#waitlist`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}