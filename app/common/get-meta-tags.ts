interface MetaTags {
  title: string;
  description: string;
  url: string;
}

export function getMetaTags(tags: MetaTags) {
  const metaTags = [
    { title: `${tags.title} | SermonIndex` },
    {
      name: 'description',
      content: tags.description,
    },
    { property: 'og:title', content: tags.title },
    {
      property: 'og:description',
      content: tags.description,
    },
    {
      property: 'og:image',
      content: 'https://sermonindex3.b-cdn.net/si-images/og-image.png',
    },
    {
      property: 'og:url',
      content: tags.url,
    },
  ];

  return metaTags;
}
