import StudioClient from './StudioClient';

export function generateStaticParams() {
  return [
    { index: [] },
    { index: ['structure'] },
  ];
}

export default function StudioPage() {
  return <StudioClient />;
}
