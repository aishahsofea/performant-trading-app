import { ProfileTabs } from "@/components/profile/profile-tabs";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-100 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-400">
              Manage your account information and trading preferences
            </p>
          </div>

          <ProfileTabs />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
