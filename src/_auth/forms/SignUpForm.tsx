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
import { SignUpValidation } from "@/validation";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/services/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

// test users1
// email: avengers@example.com
// password: Asdfghjkl

//user2
//email : himanshu@example.com
//password: Lkjhgfdsa

function SignUpForm() {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUserAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    //create a new account
    const newUser = await createUserAccount(values);
    if (!newUser) toast("Sign up failed. Please try again");

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
          Create a new account
        </h2>
        <p className="mt-2 text-muted-foreground small-medium md:base-regular">
          Please enter details to use Pixo
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5 mt-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="username..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button
            disabled={isCreatingUserAccount || isUserLoading || isSigningIn}
            type="submit"
          >
            {isCreatingUserAccount ? "Submitting...." : "Submit"}
          </Button>

          <p className="mb-2 text-center text-small-regular text-muted-foreground">
            Already have an account?
            <Link className="font-bold text-secondary" to="/sign-in">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignUpForm;
