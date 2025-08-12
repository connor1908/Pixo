import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/debounce";
import {
  useGetInfinitePosts,
  useSearchPosts,
} from "@/services/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { IoSearchOutline } from "react-icons/io5";
import ExploreLoader from "@/components/shared/ExploreLoader";
// import { IoFilterOutline } from "react-icons/io5";

function Explore() {
  const { ref, inView } = useInView();
  const [search, setSeach] = useState("");
  const debouncedValue = useDebounce(search, 1000);
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isPending,
  } = useGetInfinitePosts();
  const { data: searchedPosts, isFetching } = useSearchPosts(debouncedValue);

  useEffect(() => {
    if (inView && !search) fetchNextPage();
  }, [inView, search, fetchNextPage]);

  if (isPending) return <Loader />;

  if (!posts) return;

  const showSearchResults = search !== "";
  const showPosts =
    !showSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="w-full h3-bold md:h2-bold">Search Posts</h2>
        <div className="flex items-center w-full gap-1 px-4 rounded-lg bg-muted">
          <IoSearchOutline size={24} />
          <Input
            type="text"
            placeholder="Search Post By Caption"
            className="explore-search"
            value={search}
            onChange={(e) => setSeach(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full max-w-full mt-16 mb-6 flex-between">
        <h3 className="body-bold md:h3-bold">Popular Posts</h3>

        {/* implement filter in the future */}
        {/* <div className="gap-3 px-4 py-2 cursor-pointer bg-muted flex-center rounded-xl">
          <p className="small-medium md:base-medium text-muted-foreground">
            All
          </p>
          <IoFilterOutline size={24} />
        </div> */}
      </div>

      <div className="flex flex-wrap w-full max-w-5xl gap-9">
        {showSearchResults ? (
          <SearchResults
            isFetching={isFetching}
            searchedPosts={searchedPosts}
          />
        ) : showPosts ? (
          <p className="w-full mt-6 text-center text-muted">End of posts</p>
        ) : (
          posts.pages.map((item, index) => {
            return (
              <GridPostList key={`page-${index}`} posts={item?.documents} />
            );
          })
        )}
      </div>

      {hasNextPage && !search && (
        <div ref={ref} className="mt-10">
          <ExploreLoader />
        </div>
      )}
    </div>
  );
}

export default Explore;
