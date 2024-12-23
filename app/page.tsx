import Image from "next/image";
import image from '@/images/image.png'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWritter from "@/components/StoryWritter";
export default function Home() {
  return (
    <div className="flex-1 flex flex-col" >
    <section className="flex-1 grid grid-cols-1 lg:grid-cols-2" >
      <div className="bg-purple-500 flex flex-col items-center justify-center space-y-5 order-1 lg:-order-1 pb-10 " >
        <Image src={image} height={250} alt="Logo"  />
        <Button asChild className="px-20 bg-purple-500 p-10 text-xl drop-shadow-lg" >
          <Link href="/stories" >Explore Story Library</Link>
        </Button>
      </div>
      <StoryWritter/>
    </section>
    </div>
  );
}
