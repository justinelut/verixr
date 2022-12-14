import React from 'react';
import payload from 'payload';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { Type as PageType } from '../collections/Page';
import NotFound from '../components/NotFound';
import Landing from '../components/frontend';
import useHomepage from "../store/home"


const { publicRuntimeConfig: { SERVER_URL } } = getConfig();

export type Props = {
  page?: PageType
  statusCode: number
}

const Page: React.FC<Props> = ({page}) => {
  const addToMenu = useHomepage((state) => state.addToMenu);
  addToMenu(page)

  return (
    
    <>
    <Landing />
    </>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug ? (ctx.params.slug as string[]).join('/') : 'home';

  const pageQuery = await payload.find({
    collection: 'pages'
  });


  if (!pageQuery.docs[0]) {
    ctx.res.statusCode = 404;

    return {
      props: {},
    };
  }

  return {
    props: {
      page: pageQuery.docs[0].menu,
    },
  };
};
