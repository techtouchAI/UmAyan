'use client';

import dynamic from 'next/dynamic';

const NextStudioNoSSR = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
);

import config from '../../../../sanity.config';

export default function StudioClient() {
  return <NextStudioNoSSR config={config} />;
}
