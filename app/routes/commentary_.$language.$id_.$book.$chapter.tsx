import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa';
import { fetchApi } from '~/api/sdk';
import { OsisToBookName } from '~/common/bible-constants';
import { CommentaryChapterData } from '~/components/commentary-chapter';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const { language, id, book, chapter } = params;

  const commentary = await fetchApi<any>(
    `/commentary/${language}/${id}/${book}/${chapter}`,
  );

  if ('statusCode' in commentary) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { commentary };
}

export default function Index() {
  const { commentary } = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <div className="flex w-full min-h-28 items-center justify-center space-x-14 md:space-x-24">
        <Link
          to={`/commentary/eng/${commentary.id}/${commentary.book}/${commentary.previousChapter}`}
        >
          <IconContext.Provider
            value={{
              className:
                'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200',
            }}
          >
            <FaRegArrowAltCircleLeft />
          </IconContext.Provider>
        </Link>
        <span className="text-3xl md:text-4xl">{`${
          OsisToBookName[commentary.book as keyof typeof OsisToBookName]
        } ${commentary.chapter}`}</span>
        <span className="hover:underline hover:cursor-pointer">
          <Link
            to={`/commentary/eng/${commentary.id}/${commentary.book}/${commentary.nextChapter}`}
          >
            <IconContext.Provider
              value={{
                className:
                  'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200',
              }}
            >
              <FaRegArrowAltCircleRight />
            </IconContext.Provider>
          </Link>
        </span>
      </div>
      <SiSection title={commentary.name}>
        <CommentaryChapterData commentary={commentary} />
      </SiSection>
    </SiPage>
  );
}
