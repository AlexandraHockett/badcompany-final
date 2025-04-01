// app/(root)/profile/page.tsx (server component)
import { Suspense } from "react";
import ProfilePage from "@/components/ProfilePage";
import Loading from "@/components/Loading";

export default function ProfileRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfilePage />
    </Suspense>
  );
}
