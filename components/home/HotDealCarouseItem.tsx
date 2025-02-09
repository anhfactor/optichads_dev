import Image from "next/image";
import useSWR, { KeyedMutator } from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

import { CarouselItem } from "../ui/carousel";
import { cn } from "@/lib/utils";
import { serialize } from "@/lib/helpers";
import { BestListingsResponse, NFTExpanded } from "@/pages/api/types";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

import ConfirmFloorBuyDialogBtn from "./ConfirmFloorBuyDialogBtn";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const carouselItemCSS = (chain: string) =>
  cn(
    "flex flex-col basis-full md:basis-1/2 rounded-sm my-16 xl:my-20 text-slate-800 px-6",
    "max-w-[700px]"
  );

const gradientFonts = (chain: string) =>
  cn(
    "flex items-center bg-clip-text text-transparent font-semibold bg-gradient-to-r dark:bg-gradient-to-r",
    chain === "optimism"
      ? "from-red-400 to-red-100"
      : chain === "base"
        ? "from-blue-400 to-blue-100"
        : "from-indigo-400 to-indigo-100"
  );

const titleCss =
  "my-2 md:my-4 text-lg md:text-xl lg:text-4xl desktop:text-5xl uppercase px-0 lg:px-8 font-semibold md:font-extrabold truncate";

const HotDealCarouselItem = ({
  identifier,
  chain,
  address,
  price,
  hash,
  protocol_address,
  date,
  mutate,
}: {
  identifier: string;
  chain: string;
  address: string;
  price: string;
  hash: string;
  protocol_address: string;
  date: number;
  mutate: KeyedMutator<BestListingsResponse>;
}) => {
  const params = serialize({ address, chain, identifier });
  const { isConnected } = useAccount();

  const { data, isLoading, error } = useSWR<NFTExpanded>(
    `/api/opensea/getNFT${params}`,
    { revalidateOnFocus: false, focusThrottleInterval: 20000 }
  );

  if (isLoading) {
    <CarouselItem className={carouselItemCSS(chain)}>
      <div className="flex flex-col">
        <Skeleton className="w-full h-full p-8 bg-gray-300 animate-pulse" />
      </div>
    </CarouselItem>;
  }
  if (error) {
    <div className="flex flex-col">
      <Skeleton className="w-full h-full p-8 bg-gray-300" />
    </div>;
  }

  return (
    data &&
    data.nft && (
      <CarouselItem className={carouselItemCSS(chain)}>
        {data.nft?.name && (
          <h4 className={titleCss}>
            <span className={gradientFonts(chain)}>{data.nft.name}</span>
          </h4>
        )}
        <Image
          className={cn(
            "flex p-3 xl:p-5 desktop:p-8 rounded-md bg-white shadow drop-shadow-sm lg:shadow-2xl lg:drop-shadow-2xl"
          )}
          src={data.nft.image_url}
          alt={data.nft.description || ""}
          width={700}
          height={700}
        />
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-start flex-col lg:flex-row lg:space-y-0 space-x-0 lg:space-x-2 pt-4 lg:pt-2">
            <Link
              href={`https://opensea.io/assets/${chain}/${address}/${identifier}`}
              className="hidden sm:flex items-center"
              target="_blank"
            >
              <Button variant="ghost" className="text-white md:mt-0 mt-2">
                View on Opensea
              </Button>
            </Link>
            {isConnected ? (
              <ConfirmFloorBuyDialogBtn
                nft={data.nft}
                hash={hash}
                chain={chain}
                protocol_address={protocol_address}
                price={price}
                mutate={mutate}
              />
            ) : (
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");
                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button onClick={openConnectModal}>Buy Now</Button>
                          );
                        }
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            )}
          </div>
          <div className="flex flex-col w-full lg:w-auto items-end my-4 pt-0 md:pt-2 px-1 space-y-3">
            <div className="flex justify-center items-center text-lg md:text-2xl lg:text-3xl desktop:text-4xl space-x-1 lg:space-x-2">
              <FontAwesomeIcon
                icon={faEthereum}
                className="text-gray-100 h-3 lg:h-5 leading-none"
              />
              <span className={gradientFonts(chain)}>{price.slice(0, 7)}</span>
            </div>

            {/* {data.nft.rarity && (
              <div className="text-base desktop:text-2xl text-white">
                Rarity# {data.nft.rarity.rank}
              </div>
            )} */}

            <div className="hidden sm:inline-flex min-w-[130px] text-base leading-none desktop:text-2xl text-white">
              Ends: {new Date(date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CarouselItem>
    )
  );
};

export default HotDealCarouselItem;
