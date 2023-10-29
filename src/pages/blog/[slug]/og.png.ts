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
  const imagePath = path.resolve('./src/assets/img/og_background.jpg');
  console.log('Image path: ', imagePath);
  const postCover = fs.readFileSync(imagePath);
  const imageBase64 = postCover.toString('base64');

  const html: any = {
    type: 'div',
    props: {
      children: [
        {
          type: 'div',
          props: {
            tw: 'text-white text-7xl font-bold p-6 max-w-[60%]',
            children: post.title,
          },
        },
      ],
      tw: 'w-full h-full flex flex-col justify-center',
      style: {
        backgroundImage: `url(data:image/jpeg;base64,${imageBase64})`,
        fontFamily: 'Open Sans Regular',
        backgroundSize: 'contain', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      },
    },
  };

  return new ImageResponse(html, {
    width: 1280,
    height: 720,
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
