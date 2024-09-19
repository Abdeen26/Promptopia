"use client";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import PromptCard from "./PromptCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

export default function Feed() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch posts
  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data);
    setFilteredPosts(data); // Set both posts and filtered posts initially
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Search filter function
  const filterPrompts = (searchText) => {
    const lowerCasedSearch = searchText.toLowerCase();
    const filtered = posts.filter(
      (item) =>
        item.creator.username.toLowerCase().includes(lowerCasedSearch) ||
        item.prompt.toLowerCase().includes(lowerCasedSearch) ||
        item.tag.toLowerCase().includes(lowerCasedSearch)
    );
    setFilteredPosts(filtered);
  };

  // Debounced search function using lodash.debounce
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      filterPrompts(searchTerm);
    }, 500),
    [posts]
  );

  // Apply filter when URL contains a tag after posts are loaded
  useEffect(() => {
    if (searchParams && posts.length > 0) {
      // Ensure posts are fetched
      const searchedTag = searchParams.get("tag");
      if (searchedTag) {
        setSearchText(searchedTag); // Update input field with the tag
        filterPrompts(searchedTag); // Filter posts based on the tag
      }
    }
  }, [searchParams, posts]); // Listen to changes in searchParams and posts

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  // Handle tag click
  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    filterPrompts(tagName);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or prompt"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={filteredPosts.length > 0 ? filteredPosts : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
}
