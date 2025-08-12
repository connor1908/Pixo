import { Link, useNavigate } from "react-router";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/services/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

function Topbar() {
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess, isPending } = useSignOutAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in", { replace: true }); // reloads the page
    }
  }, [isSuccess, navigate]);

  return (
    <section className="topbar">
      <div className="px-5 py-4 flex-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" width={130} height={325} alt="logo" />
        </Link>

        <div className="flex gap-4">
          <Button
            disabled={isPending}
            className="bg-secondary"
            onClick={() => signOut()}
          >
            <RiLogoutBoxLine className="w-6 h-6" />
          </Button>
          <Link to="/profile/${user.id}" className="gap-3 flex-center">
            <img
              src={user.imageUrl || "/assets/profile-default-avatar.svg"}
              alt="user image"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Topbar;
