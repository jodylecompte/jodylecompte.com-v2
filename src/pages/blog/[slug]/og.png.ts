import fs from 'fs';
import path from 'path';
import { ImageResponse } from '@vercel/og';
import { loadPosts } from '../../../util/loadPosts';

interface Props {
  params: { slug: string };
  props: { post: any };
}

export async function GET({ props }: Props) {
  const { post } = props;

  console.log(post);

  // using custom font files
  const OpenSansBold = fs.readFileSync(path.resolve('./public/fonts/OpenSans-Bold.woff'));
  const OpenSansReqular = fs.readFileSync(path.resolve('./public/fonts/OpenSans-Regular.woff'));

  // // post cover with Image is pretty trick
  const imagePath = path.resolve('./src/assets/img/og_selfie.png');
  console.log('Image path: ', imagePath)
  const postCover = fs.readFileSync(imagePath);

  const html: any = {
    type: 'div',
    props: {
      children: [
        {
          type: 'div',
          props: {
            // using tailwind
            tw: 'w-[200px] h-[200px] flex rounded-3xl overflow-hidden flex-column',
            children: [
              {
                type: 'img',
                props: {
                  src: postCover.buffer,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            tw: 'pl-10 shrink flex text-white',
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '48px',
                    fontFamily: 'Open Sans Bold',
                  },
                  children: post.title,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            tw: 'absolute right-[40px] bottom-[40px] flex items-center text-white',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'text-white text-3xl p-2 rounded',
                  style: {
                    fontFamily: 'Open Sans Bold',
                    background: 'linear-gradient(to left,#faa23d,#f70965)',
                  },
                  children: 'Blog Posts by Jody LeCompte',
                },
              },
            ],
          },
        },
      ],
      tw: 'w-full h-full flex flex-columm items-center justify-center relative px-22',
      style: {
        background: '#161618',
        fontFamily: 'Open Sans Regular',
      },
    },
  };

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: 'Open Sans Bold',
        data: OpenSansBold.buffer,
        style: 'normal',
      },
      {
        name: 'Open Sans Regular',
        data: OpenSansReqular.buffer,
        style: 'normal',
      },
    ],
  });
}

// to generate an image for each blog posts in a collection
export async function getStaticPaths() {
  const blogPosts = await loadPosts();
  return blogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
