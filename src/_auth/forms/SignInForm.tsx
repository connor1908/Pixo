import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

//file imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInValidation } from "@/validation";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useSignInAccount } from "@/services/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

function SignInForm() {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  // const { mutateAsync: createUserAccount, isPending: isCreatingUserAccount } =
  //   useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    // //create a new account
    // const newUser = await createUserAccount(values);
    // if (!newUser) toast("Sign up failed. Please try again");

    //create session (logs in user)
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) toast('"Sign in failed. Please try again');

    // add session to our context
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast("Sign up failed. Please try again");
    }
  }

  return (
    <Form {...form}>
      <div className="flex-col flex-center sm:w-420">
        <img src="/assets/logo.png" className="w-48" alt="logo" />
        <h2 className="pt-4 h3-bold md:h2-bold sm:pt-6">
          Log in to your account
        </h2>
        <p className="mt-2 text-muted-foreground small-medium md:base-regular">
          Welcome back! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5 mt-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isUserLoading || isPending} type="submit">
            {isUserLoading ? "Submitting...." : "Sign In"}
          </Button>

          <p className="mb-2 text-center text-small-regular text-muted-foreground">
            Don't have an account?
            <Link className="font-bold text-secondary" to="/sign-up">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignInForm;
