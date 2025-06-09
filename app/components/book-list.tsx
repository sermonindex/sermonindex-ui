import { Link } from "@remix-run/react"
import { useState } from "react"
import { MediaType } from "~/api/interfaces"
import { BookCover } from "./book-cover"
import DropdownCheckbox from "./dropdown-checkbox"

export interface BookListProps {
  books: any[];
}

export const BookList = ({books}: BookListProps) => {
    const [title, setTitle] = useState<string>("");
    const [mediaTypes, setMediaTypes] = useState<MediaType[]>(
      Object.values(MediaType),
    );

    return (
        <div>
          <div className="flex items-center space-x-4">
            <input
              className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
              placeholder="Find a book..."
              onChange={(e) => setTitle(e.target.value.toLowerCase())}
              required
            />
            <DropdownCheckbox
              title="Filter Media"
              options={[MediaType.Text, MediaType.Audio]}
              onFilterChange={(options: string[]) =>
                setMediaTypes(options as MediaType[])
              }
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 pt-4">
            {books
              .filter(
                (b: any) =>
                  (b.title.toLowerCase().includes(title) || b.contributor.fullName.toLowerCase().includes(title)) &&
                  mediaTypes.includes(b.mediaType),
              )
              .map((book: any, index: number) => (
                <Link to={`/books/${book.id}/1`} key={index}>
                  <BookCover book={book} />
                </Link>
              ))}
          </div>
        </div>
    )
}