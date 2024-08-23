import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from 'next/navigation'

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect('/sign-in')
  } else {
    // console.log("clerkUser, ", clerkUser);
  }

  const documents = [];
  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {
        documents.length > 0 ? (
          <div className="">

          </div>
        ) : (
          <div className="document-list-empty">
            <Image src={'/assets/icons/doc.svg'} width={40} height={40} alt="document" className="mx-auto" />
            <AddDocumentBtn
              userId={clerkUser?.id}
              email={clerkUser?.emailAddresses[0].emailAddress}
            />
          </div>
        )
      }
    </main>
  );
}


export default Home