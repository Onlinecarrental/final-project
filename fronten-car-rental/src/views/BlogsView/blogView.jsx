import { useState } from "react";
import HeroSectionBlogs from "./heroSectionBlogs";
import AllBlogs from "./allBlogs";

export default function BlogsView() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <HeroSectionBlogs onSearch={setSearchTerm} />
      <AllBlogs searchTerm={searchTerm} />
    </div>
  );
}
