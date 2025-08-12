import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/services/react-query/queriesAndMutations";
import { Link, useParams } from "react-router";
import { FaUserEdit } from "react-icons/fa";

function Profile() {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: currentUser, isPending } = useGetUserById(id || "");

  if (isPending) return <Loader />;

  return (
    <section className="profile-container">
      <div className="profile-inner_container">
        <div className="flex flex-col flex-1 xl:flex-row max-xl:items-center gap-7">
          <img
            src={currentUser?.imageUrl || "/assets/profile-default.avatar.svg"}
            alt="profile"
            className="rounded-full w-28 h-28 lg:h-36 lg:w-36"
          />

          <div className="flex flex-col justify-between flex-1 md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="w-full text-center xl:text-left h3-bold md:h1-semibold">
                {currentUser?.name}
              </h1>
              <p className="text-center small-regular md:body-medium text-muted xl:text-left">
                @{currentUser?.username}
              </p>
            </div>

            <p className="max-w-screen-sm text-center small-medium md:base-medium xl:text-left mt-7">
              {currentUser?.bio}
            </p>

            <div className="flex justify-center gap-4 xl:justify-start">
              <div className={`${user.id !== currentUser?.$id && "hidden"}`}>
                <Link
                  to={`/update-profile/${currentUser?.$id}`}
                  className={`h-12 bg-dark-4 px-5 flex-center gap-2 rounded-lg ${
                    user.id !== currentUser?.$id && "hidden"
                  }`}
                >
                  <FaUserEdit size={24} className="text-primary" />
                  <p className="flex whitespace-nowrap small-medium">
                    Edit Profile
                  </p>
                </Link>
              </div>

              <div className={`${user.id === id && "hidden"}`}>
                <Button type="button">Follow</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
