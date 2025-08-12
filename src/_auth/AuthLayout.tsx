import { Navigate, Outlet } from "react-router";

function AuthLayout() {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-col items-center justify-center flex-1 py-8">
            <Outlet />
          </section>
        </>
      )}
    </>
  );
}

export default AuthLayout;
