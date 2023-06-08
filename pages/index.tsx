import type { NextPage } from "next";
import Image from "next/image";
import vitalikApproves from "../public/images/vitalik_approves.png";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import {
  BgImageColorHeroSection,
  DarkHeroSectionClouds,
  DarkOverlapShell,
  FAQs,
  FeatureList,
  HeadMeta,
  OptiBabesTeam,
  PricingPlan,
  Team,
} from "../components";

export async function getStaticProps({locale}:any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['chads']))
    }
  }
}

const Home: NextPage = () => {
  return (
    <>
      <HeadMeta />
      <DarkHeroSectionClouds />
      <BgImageColorHeroSection />
      <DarkOverlapShell title="Promoting Health in Web3">
        <div className="rounded-lg bg-white pb-6 shadow">
          <PricingPlan />
          <FeatureList />
          <OptiBabesTeam />
          <Image
            alt="a sick tweet bro"
            src={vitalikApproves}
            height={900}
            width={1255}
          />
          <Team />
        </div>
      </DarkOverlapShell>
    </>
  );
};

export default Home;
