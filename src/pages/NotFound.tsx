import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center  bg-[#EDEBE7] relative py-10">
      <div className="text-center relative">
        <h1 className="mb-4 text-4xl font-bold">404 (Gravity — 1, Turtle — 0)</h1>
        <p className="mb-4 text-xl text-gray-600">I’m trying my best… the page isn’t.</p>
        <img src="/_404.gif" className="w-[75%] h-[20%] mx-auto" />

        <Button onClick={() => navigate('/')} className="bg-[#8EDBDF] hover:bg-[#EB825D] text-gray-800">Back to Business</Button>
      </div>
    </div>
  );
};

export default NotFound;
