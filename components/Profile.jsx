"use client";
import { usePathname, useRouter } from "next/navigation";
import PromptCard from "./PromptCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const router = useRouter();
  const pathName = usePathname();
  const handleTagClick = (tag) => {
    if (pathName !== "/") {
      router.push(`/?tag=${tag}`);
    }
  };
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-16 prompt_layout">
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleDelete && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
            handleTagClick={() => handleTagClick && handleTagClick(post.tag)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
