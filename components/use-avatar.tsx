import { getInitials } from "@/utils/getInitials";

type AvatarSize = "sm" | "md" | "lg";

type UserAvatarProps = {
  fullName: string;
  size?: AvatarSize;
};

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: "w-8 h-8",   text: "text-xs"  },
  md: { container: "w-12 h-12", text: "text-base" },
  lg: { container: "w-16 h-16", text: "text-xl"   },
};

const UserAvatar = ({ fullName, size = "md" }: UserAvatarProps) => {
  const { container, text } = sizeMap[size];

  return (
    <div className={`${container} rounded-full bg-[#FF6B7A] flex items-center justify-center shrink-0`}>
      <span className={`${text} font-medium font-bold text-white`}>
        {getInitials(fullName)}
      </span>
    </div>
  );
};

export default UserAvatar;