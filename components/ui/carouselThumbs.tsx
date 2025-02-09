import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { divergentLinkButtonCSS } from "./button";
import Link from "next/link";

type PropType = {
  groups: Array<any>;
  options?: EmblaOptionsType;
};

type ThumbPropType = {
  selected: boolean;
  onClick: () => void;
  collection: any;
};

const Thumb: React.FC<ThumbPropType> = (props) => {
  const { selected, onClick, collection } = props;

  return (
    <div
      className={"embla-thumbs__slide ".concat(
        selected ? " embla-thumbs__slide--selected" : ""
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        {collection.name}
      </button>
    </div>
  );
};

const CarouselThumbs: React.FC<PropType> = (props) => {
  const { groups, options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="m-auto max-full embla">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {groups.map((collection) => (
            <div
              className={`embla__slide h-full md:p-12 p-12 mt-12 md:mt-0`}
              key={collection.name}
            >
              <div
                className={`relative md:p-16 p-12 flex md:gap-20 gap-2 ${collection.bgColor} rounded-3xl`}
              >
                <Image
                  className="h-1/3 w-1/3 bg-white p-1 rounded-xl"
                  src={collection.img}
                  alt={collection.name}
                />
                <div>
                  <div className="text-4xl font-semibold">
                    {collection.name}
                  </div>
                  <div className="font-extrabold">
                    Collection: {collection.collection}
                  </div>
                  <div
                    className={`${collection.bgDescription} text-gray-100 p-2 rounded-xl my-4 hidden md:block`}
                  >
                    {collection.shortDescription}
                  </div>
                  <div className="p-2 rounded-xl hidden md:block">
                    {collection.description}
                  </div>
                  <div className="mt-3 lg:mt-8">
                    <Link
                      href={`https://opensea.io/collection/${collection.slug}`}
                      className={divergentLinkButtonCSS}
                      target="_blank"
                    >
                      View collection
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="-mt-24 lg:mx-48 mx-12  pb-10 hidden md:block">
          <div className="" ref={emblaThumbsRef}>
            <div className="flex gap-4">
              {groups.map((collection) => (
                <div className="cursor-pointer" key={collection.index}>
                  <Image
                    key={collection.index}
                    className="w-2/3 p-1 bg-gray-100 rounded-full hover:-translate-y-2 hover:scale-200 duration-300"
                    onClick={() => onThumbClick(collection.index)}
                    src={collection.img}
                    alt={collection.name}
                  />
                  <div className="lg:ml-3 font-semibold lg:text-base text-sm ">
                    {collection.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselThumbs;
