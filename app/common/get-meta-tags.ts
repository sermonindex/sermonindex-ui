interface MetaTags {
  title: string;
  description: string;
  url: string;
}

export function getMetaTags(tags: MetaTags) {
  if (tags.title === 'SermonIndex' || tags.title === undefined || tags.title === null) {
    tags.title = 'SermonIndex';
  } else {
    tags.title = `${tags.title} | SermonIndex`;
  }

  const metaTags = [
    { title: tags.title },
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale-1' },
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
