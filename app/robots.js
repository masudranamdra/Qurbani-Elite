export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/my-profile/', '/update-profile/'],
    },
    sitemap: `${process.env.BETTER_AUTH_URL}/sitemap.xml`,
  }
}
