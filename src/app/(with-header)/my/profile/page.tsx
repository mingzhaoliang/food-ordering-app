import { verifyEmail } from "@/actions/auth/verifyEmail";
import AvatarUploader from "@/components/my/profile/avatar-uploader";
import ProfileForm from "@/components/my/profile/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { validateRequest } from "@/lib/lucia/auth";
import { getProfile } from "@/services/mongoose/my/profile.dal";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <div className="bg-white rounded-3xl max-sm:p-6 p-8 max-lg:space-y-4 space-y-6">
        <h3 className="heading-3">Profile</h3>
        <Separator className="my-2" />
        <Button variant="link" asChild>
          <Link href="/signin">Sign in to view your profile.</Link>
        </Button>
      </div>
    );
  }

  const profile = await getProfile();

  const verificationStatus = user.emailVerified ? (
    <Badge className="ml-2" variant="success">
      Verified
    </Badge>
  ) : (
    <form action={verifyEmail.bind(null, false)}>
      <button>
        <Badge className="ml-2" variant="outline">
          Verify now
          <ChevronRight className="w-3 h-3 ml-1" />
        </Badge>
      </button>
    </form>
  );

  return (
    <div className="bg-white rounded-3xl max-sm:p-6 p-8 max-lg:space-y-4 space-y-6">
      <h3 className="heading-3">Profile</h3>
      <div className="relative flex items-center gap-3">
        <Avatar className="lg:w-14 lg:h-14">
          <AvatarImage src={profile.avatar ? profile.avatar.imageUrl : ""} alt="avatar" />
          <AvatarUploader />
          <AvatarFallback>{profile.firstName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="body-2">{profile.fullName}</p>
          <div className="flex">
            <p className="body-3 text-fade text-nowrap text-ellipsis overflow-hidden">{user.email}</p>
            {verificationStatus}
          </div>
        </div>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
