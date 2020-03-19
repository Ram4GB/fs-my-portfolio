import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actionSaga from "../actions";
import { MODULE_NAME as MODULE_TODO } from "../models";
import BlogItem from "./BlogItem";

export default function BlogList() {
  const blogs = useSelector(state => state[MODULE_TODO].blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionSaga.loadBlog());
  }, [dispatch]);

  const renderBlogs = () => {
    return blogs.map(blog => {
      return <BlogItem blog={blog} key={blog.id} />;
    });
  };
  return <div>{renderBlogs()}</div>;
}