import { createFileRoute } from "@tanstack/react-router";
import Editor from "~/components/Editor";


export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
   
      <Editor/>
    </div>
  );
}
