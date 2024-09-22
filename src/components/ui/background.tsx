import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

const Background = ({ src }: { src: StaticImport }) => {
  return (
    <Image
      src={src}
      alt="background"
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      className="absolute inset-0 -z-10 object-cover"
    />
  );
};

export default Background;
