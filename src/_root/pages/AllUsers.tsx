import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useGetUsers } from "@/services/react-query/queriesAndMutations";

function AllUsers() {
  const { data: creators, isPending } = useGetUsers();

  if (isPending) return <Loader />;

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="w-full text-left h3-bold md:h2-bold">All Users</h2>
        <ul className="user-grid">
          {creators?.documents.map((creator) => (
            <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AllUsers;
