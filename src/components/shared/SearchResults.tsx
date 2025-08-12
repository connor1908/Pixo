import type { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResutlsProps = {
  isFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document> | undefined;
};

function SearchResults({ isFetching, searchedPosts }: SearchResutlsProps) {
  if (isFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }

  return <p className="w-full text-center text-muted">No results found</p>;
}

export default SearchResults;
