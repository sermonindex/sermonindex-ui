import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { ListResponse, SermonInfo } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getMetaTags } from '~/common/get-meta-tags';
import { SiSection } from '~/components/section';
import { SermonCard } from '~/components/sermon-card';
import { SiPage } from '~/components/si-page';
import { Teaser } from '~/components/teaser';
import { TeaserSermon } from '~/components/teaser-sermon';

export const meta: MetaFunction = () => {
  const title = 'SermonIndex';
  const description =
    "SermonIndex's assignment is to honour and preserve the past preaching of God's Word and to promote revival to this generation.";
  const url = 'https://sermonindex.net';

  return getMetaTags({
    title,
    description,
    url,
  });
};

export async function loader({ params }: LoaderFunctionArgs) {
  const [featuredSermons] = await Promise.all([
    fetchApi<ListResponse<SermonInfo>>('/sermons/featured?offset=0&limit=2'),
  ]);

  if ('statusCode' in featuredSermons || !(featuredSermons.values.length > 1)) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }
  return {
    featured: featuredSermons.values[0],
    previouslyFeatured: featuredSermons.values[1],
  };
}

interface ItemsGroupProps {
  items: { text: string; route: string }[];
  showMore?: { text: string; route: string };
}

const ItemsGroup = ({ items, showMore }: ItemsGroupProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-x-1 gap-y-2 md:gap-1 pb-6">
        {items.map((item) => (
          <Link to={item.route} key={item.route}>
            <span className="px-2 py-1 text-sm rounded-lg hover:cursor-pointer bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-600 hover:dark:bg-neutral-700">
              {item.text}
            </span>
          </Link>
        ))}
      </div>
      {showMore && (
        <Link to={showMore.route}>
          <div className="flex items-center justify-end font-semibold text-si-main dark:text-si-olive hover:underline">
            <span className="">{showMore.text}</span>
            <span className="ml-2 mt-1">
              <FaArrowAltCircleRight />
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

const Teasers = ({
  previouslyFeatured,
}: {
  previouslyFeatured: SermonInfo;
}) => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      <Teaser
        type={'Previously Featured Sermon'}
        title={previouslyFeatured.title}
        link={`/sermons/${previouslyFeatured.id}`}
        imageUrl={previouslyFeatured.thumbnailUrl}
        author={previouslyFeatured.contributorFullName}
        mediaType={previouslyFeatured.mediaType.toString().toLowerCase()}
        views={previouslyFeatured.views}
      />

      <Teaser
        type={'Featured Blog'}
        title={'A New Chapter for SermonIndex'}
        link={`/blog/a_new_chapter_for_sermonindex`}
        imageUrl={'https://sermonindex3.b-cdn.net/newsite-announcement.jpg'}
        text={
          'After much prayer, planning, and work behind the scenes, we are grateful to announce the launch of the new SermonIndex.net website. For over two decades, SermonIndex has been a place where believers from all over the world can access historic sermons, revival resources, and messages that lift up the name of Jesus Christ. Our heart has never changed — to encourage a deeper walk with God, to inspire personal holiness, and to point the Church back to the simplicity and power of the Gospel.'
        }
        author={'Greg Gordon'}
        mediaType={'blog'}
      />
    </div>
  );
};

export default function Index() {
  const { featured, previouslyFeatured } = useLoaderData<typeof loader>();

  const featuredSpeakers: { name: string; slug: string; imageUrl: string }[] = [
    {
      name: 'A.W. Tozer',
      slug: 'aw-tozer',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/awtozer.png',
    },
    {
      name: 'Art Katz',
      slug: 'art-katz',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/artkatz.png',
    },
    {
      name: 'Bill McLeod',
      slug: 'bill-mcleod',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/billmcleod.png',
    },
    {
      name: 'Carter Conlon',
      slug: 'carter-conlon',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/carterconlon.png',
    },
    {
      name: 'Chuck Smith',
      slug: 'chuck-smith',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/chucksmith.png',
    },
    {
      name: 'David Wilkerson',
      slug: 'david-wilkerson',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/davidwilkerson.png',
    },
    {
      name: 'Keith Daniel',
      slug: 'keith-daniel',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/keithdaniel.png',
    },
    {
      name: 'Leonard Ravenhill',
      slug: 'leonard-ravenhill',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/leonardravenhill.png',
    },
    {
      name: 'Oswald J. Smith',
      slug: 'oswald-j-smith',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/oswaldjsmith.png',
    },
    {
      name: 'Paris Reidhead',
      slug: 'paris-reidhead',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/parisreidhead.png',
    },
    {
      name: 'Paul Washer',
      slug: 'paul-washer',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/paulwasher.png',
    },
    {
      name: 'Zac Poonen',
      slug: 'zac-poonen',
      imageUrl: 'https://sermonindex3.b-cdn.net/pdf/zacpoonen.png',
    },
  ];

  const featuredVerses: { text: string; route: string }[] = [
    { text: 'Genesis 28:15', route: '/bible/parallel/GEN/28/15' },
    { text: 'Exodus 14:14', route: '/bible/parallel/EXO/14/14' },
    { text: 'Deuteronomy 31:6', route: '/bible/parallel/DEU/31/6' },
    { text: '2 Samuel 22:31', route: '/bible/parallel/2SA/22/31' },
    { text: 'Psalm 16:11', route: '/bible/parallel/PSA/16/11' },
    { text: 'Proverbs 18:10', route: '/bible/parallel/PRO/18/10' },
    { text: 'Isaiah 40:31', route: '/bible/parallel/ISA/40/31' },
    { text: 'Jeremiah 33:3', route: '/bible/parallel/JER/33/3' },
    { text: 'Matthew 11:28', route: '/bible/parallel/MAT/11/28' },
    { text: 'John 14:27', route: '/bible/parallel/JHN/14/27' },
    { text: 'John 3:16', route: '/bible/parallel/JHN/3/16' },
    { text: 'Acts 4:12', route: '/bible/parallel/ACT/4/12' },
    { text: 'Romans 8:28', route: '/bible/parallel/ROM/8/28' },
    { text: '1 Corinthians 10:13', route: '/bible/parallel/1CO/10/13' },
    { text: 'Revelation 3:20', route: '/bible/parallel/REV/3/20' },
  ];

  const featuredTopics: { text: string; route: string }[] = [
    { text: 'Christ', route: '/topics/christ' },
    { text: 'Love', route: '/topics/love' },
    { text: 'Grace', route: '/topics/grace' },
    { text: 'Sin', route: '/topics/sin' },
    { text: 'Faith', route: '/topics/faith' },
    { text: 'Salvation', route: '/topics/salvation' },
    { text: 'Hope', route: '/topics/hope' },
    { text: 'Repentance', route: '/topics/repentance' },
    { text: 'Forgiveness', route: '/topics/forgiveness' },
    { text: 'Holy Spirit', route: '/topics/holy-spirit' },
    { text: 'Prayer', route: '/topics/prayer' },
    { text: 'Obedience', route: '/topics/obedience' },
    { text: 'Discipleship', route: '/topics/discipleship' },
    { text: 'Worship', route: '/topics/worship' },
    { text: 'Joy', route: '/topics/joy' },
    { text: 'Evangelism', route: '/topics/evangelism' },
    { text: 'Spiritual Growth', route: '/topics/spiritual-growth' },
    { text: 'Mercy', route: '/topics/mercy' },
    { text: 'Fellowship', route: '/topics/fellowship' },
    { text: 'Patience', route: '/topics/patience' },
    { text: 'Kindness', route: '/topics/kindness' },
    { text: 'Humility', route: '/topics/humility' },
    { text: 'Righteousness', route: '/topics/righteousness' },
    { text: 'Holiness', route: '/topics/holiness' },
    { text: 'Justification', route: '/topics/justification' },
    { text: 'God', route: '/topics/god' },
    { text: 'Sanctification', route: '/topics/sanctification' },
    { text: 'Resurrection', route: '/topics/resurrection' },
    { text: 'Truth', route: '/topics/truth' },
    { text: 'Peace', route: '/topics/peace' },
  ];

  const featuredVerse =
    'To this He called you through our gospel, so that you may share in the glory of our Lord Jesus Christ';
  const featuredVerseReference = {
    text: '2 Thessalonians 2:14',
    route: '/bible/parallel/2TH/2/14',
  };

  const featuredQuote =
    'God never hurries. There are no deadlines against which He must work. Only to know this is to quiet our spirits and relax our nerves.';
  const featuredQuoteAuthor = {
    name: 'A.W. Tozer',
    slug: 'aw-tozer',
  };

  const featuredBibles: { text: string; route: string }[] = [
    { text: 'Berean Standard Bible', route: '/bible/BSB' },
    { text: 'World English Bible', route: '/bible/WEBP' },
    { text: 'American Standard Version', route: '/bible/ASV' },
    { text: 'Bible in Basic English', route: '/bible/BBE' },
    { text: 'Darby Translation', route: '/bible/DBY' },
    { text: 'Translation for Translators', route: '/bible/T4T' },
    { text: 'King James Version', route: '/bible/KJV' },
    { text: 'Free Bible Version', route: '/bible/FBV' },
    { text: "Young's Literal Translation", route: '/bible/YLT' },
    { text: 'Geneva Bible 1599', route: '/bible/GNV' },
    { text: "God's Living Word", route: '/bible/GLW' },
    { text: 'One Unity Resource Bible', route: '/bible/OUR' },
    { text: 'Unlocked Literal Bible', route: '/bible/ULB' },
    { text: 'The New Testament with Commentary', route: '/bible/F35' },
  ];

  return (
    <SiPage>
      {/* Desktop View */}
      <div className="hidden lg:flex">
        <div className="flex w-2/3">
          <div className="flex-col w-full space-y-2">
            <SiSection title="Featured Sermon" sharesRightPadding={true}>
              <TeaserSermon sermon={featured} />
            </SiSection>
            <SiSection title="Featured Verse" sharesRightPadding={true}>
              <div className="px-8 pt-2">
                <span className="relative before:content-['“'] after:content-['”'] text-lg">
                  {featuredVerse}
                </span>
                <div className="flex items-center space-x-2 mt-2">
                  <Link
                    to={featuredVerseReference.route}
                    className="pl-6 pt-2 text-si-main dark:text-si-olive hover:underline"
                  >
                    - {featuredVerseReference.text}
                  </Link>
                </div>
              </div>
            </SiSection>
            <SiSection title="Featured Quote" sharesRightPadding={true}>
              <div className="px-8 pt-2">
                <span className="relative before:content-['“'] after:content-['”'] text-lg">
                  {featuredQuote}
                </span>
                <div className="flex items-center space-x-2 mt-2">
                  <Link
                    to={`/speakers/${featuredQuoteAuthor.slug}`}
                    className="pl-6 pt-2 text-si-main dark:text-si-olive hover:underline"
                  >
                    - {featuredQuoteAuthor.name}
                  </Link>
                </div>
              </div>
            </SiSection>
            <SiSection title="Online Bibles" sharesRightPadding={true}>
              <ItemsGroup
                items={featuredBibles}
                showMore={{ text: 'See More Bibles', route: '/bible' }}
              />
            </SiSection>
            <SiSection title="Other Featured Content" sharesRightPadding={true}>
              <Teasers previouslyFeatured={previouslyFeatured} />
            </SiSection>
          </div>
        </div>
        <div className="flex w-1/3 border-l-2 border-si-gray dark:border-si-rock">
          <div className="flex-col">
            <div className="grid w-full">
              <img
                src="https://sermonindex3.b-cdn.net/si-images/home-preacher.jpg"
                className="w-full object-cover col-start-1 row-start-1"
                alt="SermonIndex Preacher"
              />
              <div className="col-start-1 row-start-1 flex items-center justify-center pt-32">
                <div className="flex flex-col items-center text-white">
                  <div>
                    <span className="2xl:text-2xl font-bold">
                      Access Over {''}
                    </span>
                    <span className="italic lg:text-xl 2xl:text-3xl">
                      1 million pages
                    </span>
                  </div>
                  <div>
                    <span className="lg:text-xs 2xl:text-lg">
                      of Biblical and Sermon content for free use.
                    </span>
                  </div>
                  <div className="mt-6">
                    <Link
                      to={'/sermons'}
                      className="bg-si-accent text-si-dark px-4 py-2 rounded-lg justify-center text-center"
                    >
                      Get Started Here
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <SiSection title="Sermons By Speaker" sharesLeftPadding={true}>
              <div className="grid grid-cols-4 pb-6">
                {featuredSpeakers.map((speaker, index) => (
                  <Link to={`/speakers/${speaker.slug}`} key={index}>
                    <div
                      key={index}
                      className="flex flex-col items-center m-1 group"
                    >
                      <img
                        className="w-16 h-16 rounded-full object-cover group-hover:scale-125 transition-transform duration-200"
                        src={speaker.imageUrl}
                        alt={speaker.name}
                      />
                      <p className="text-center mt-2 text-sm group-hover:underline">
                        {speaker.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/speakers">
                <div className="flex items-center justify-end font-semibold text-si-main dark:text-si-olive hover:underline">
                  <span className="">Browse all speakers</span>
                  <span className="ml-2 mt-1">
                    <FaArrowAltCircleRight />
                  </span>
                </div>
              </Link>
            </SiSection>
            <SiSection title="Sermons By Topic" sharesLeftPadding={true}>
              <ItemsGroup
                items={featuredTopics}
                showMore={{ text: 'Browse all topics', route: '/topics' }}
              />
            </SiSection>
            <SiSection title="Sermons By Bible Verse" sharesLeftPadding={true}>
              <ItemsGroup
                items={featuredVerses}
                showMore={{
                  text: 'Browse all Bible Verses',
                  route: '/bible/BSB',
                }}
              />
            </SiSection>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col lg:hidden">
        <SiSection title="Featured Sermon">
          <Link to={`/sermons/${featured.id}`} key={featured.id}>
            <SermonCard
              sermon={featured}
              showContributor={true}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200 ease-in-out"
            />
          </Link>
        </SiSection>
        <SiSection title="Sermons By Speaker">
          <div className="grid grid-cols-4 md:grid-cols-6 pb-6">
            {featuredSpeakers.map((speaker, index) => (
              <Link to={`/speakers/${speaker.slug}`} key={index}>
                <div
                  key={index}
                  className="flex flex-col items-center m-1 group"
                >
                  <img
                    className="w-16 h-16 rounded-full object-cover group-hover:scale-125 transition-transform duration-200"
                    src={speaker.imageUrl}
                    alt={speaker.name}
                  />
                  <p className="text-center mt-2 text-sm group-hover:underline">
                    {speaker.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/speakers">
            <div className="flex items-center justify-end font-semibold text-si-main dark:text-si-olive hover:underline">
              <span className="">See More Speakers</span>
              <span className="ml-2 mt-1">
                <FaArrowAltCircleRight />
              </span>
            </div>
          </Link>
        </SiSection>
        <SiSection title="Sermons By Topic">
          <ItemsGroup
            items={featuredTopics}
            showMore={{ text: 'Browse all Topics', route: '/topics' }}
          />
        </SiSection>
        <SiSection title="Sermons By Bible Verse">
          <ItemsGroup
            items={featuredVerses}
            showMore={{
              text: 'Browse all Bible Verses',
              route: '/bible/BSB',
            }}
          />
        </SiSection>
        <SiSection title="Online Bibles" sharesRightPadding={true}>
          <ItemsGroup
            items={featuredBibles}
            showMore={{ text: 'Browse all Online Bibles', route: '/bible' }}
          />
        </SiSection>
        <SiSection title="Other Featured Content" sharesRightPadding={true}>
          <Teasers previouslyFeatured={previouslyFeatured} />
        </SiSection>
      </div>
    </SiPage>
  );
}
