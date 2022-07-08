import * as React from "react";
import Meta from "../meta/Meta";
import Footer from "./Footer";
import Header from "./Header";
import { ToastContainer } from "react-toastify";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, description, children }: Props) {
  return (
    <div className="bg-gray-200 flex-1 h-full">
      <Header ToastContainer={ToastContainer} />
      <Meta title={title} description={description} />
      {children}
      <Footer />
    </div>
  );
}
